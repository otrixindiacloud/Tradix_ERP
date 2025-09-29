import { db } from '../server/db.ts';
import { users } from '../shared/schemas/users-customers.ts';
import { eq } from 'drizzle-orm';

async function run() {
  const admin = await db.select().from(users).where(eq(users.username,'admin'));
  const testadmin = await db.select().from(users).where(eq(users.username,'testadmin'));
  console.log({ admin, testadmin });
}
run().catch(e=>{console.error(e); process.exit(1)});
