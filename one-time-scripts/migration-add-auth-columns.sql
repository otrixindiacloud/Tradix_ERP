-- Adds authentication-related columns to users table (idempotent pattern)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Optional index for quick role filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);