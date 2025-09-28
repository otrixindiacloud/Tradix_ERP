import type { Express } from 'express';
import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import ConnectPGSimple from 'connect-pg-simple';
import { db } from '../db';
import { users } from '../../shared/schemas/users-customers';
import { eq } from 'drizzle-orm';

// Initialize strategy only once
let strategyInitialized = false;

export function registerAuthRoutes(app: Express) {
  // Session store
  const PgStore = ConnectPGSimple(session);

  // Attach session & passport middleware if not already
  if (!(app as any)._authInitialized) {
    app.use(session({
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'dev-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 8, // 8h
      },
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    if (!strategyInitialized) {
      passport.use(new LocalStrategy(async (username, password, done) => {
        try {
          const row = await db.select().from(users).where(eq(users.username, username)).limit(1);
          const user = row[0];
          if (!user) return done(null, false, { message: 'Invalid credentials' });
          if (!user.passwordHash) return done(null, false, { message: 'User has no password set' });
          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return done(null, false, { message: 'Invalid credentials' });
          return done(null, { id: user.id, username: user.username, role: user.role });
        } catch (e) {
          return done(e as any);
        }
      }));

      passport.serializeUser((user: any, done) => done(null, user.id));
      passport.deserializeUser(async (id: string, done) => {
        try {
          const row = await db.select().from(users).where(eq(users.id, id)).limit(1);
          const user = row[0];
          if (!user) return done(null, false);
            done(null, { id: user.id, username: user.username, role: user.role });
        } catch (e) {
          done(e as any);
        }
      });
      strategyInitialized = true;
    }

    (app as any)._authInitialized = true;
  }

  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { username, password, email, role } = req.body;
      if (!username || !password) return res.status(400).json({ message: 'Username & password required' });
      const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existing.length) return res.status(409).json({ message: 'Username already exists' });
      const hash = await bcrypt.hash(password, 10);
      const inserted = await db.insert(users).values({ username, email, role: role || 'user', passwordHash: hash }).returning();
      res.status(201).json({ id: inserted[0].id, username, role: inserted[0].role });
    } catch (e) {
      console.error('Register error', e);
      res.status(500).json({ message: 'Failed to register user' });
    }
  });

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || 'Login failed' });
      req.logIn(user, (err2) => {
        if (err2) return next(err2);
        return res.json({ user });
      });
    })(req, res, next);
  });

  router.post('/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out' });
    });
  });

  router.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    res.json({ user: req.user });
  });

  router.get('/secure-check', (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.json({ message: 'Access granted', user: req.user });
  });

  app.use('/api/auth', router);
}
