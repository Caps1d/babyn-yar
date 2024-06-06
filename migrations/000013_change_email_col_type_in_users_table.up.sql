-- Load citext extension if not loaded
CREATE EXTENSION IF NOT EXISTS citext;

-- change the type of column email to citext
ALTER TABLE users ALTER COLUMN email TYPE citext USING email::citext;
