-- Migration: Add unique constraints to customers table
-- This migration adds unique constraints to prevent duplicate customer names and emails

-- Add unique constraint on customer name
ALTER TABLE customers ADD CONSTRAINT customers_name_unique UNIQUE (name);

-- Add unique constraint on customer email (only for non-null emails)
-- Note: This will fail if there are existing duplicate emails
-- You may need to clean up duplicates first
ALTER TABLE customers ADD CONSTRAINT customers_email_unique UNIQUE (email);
