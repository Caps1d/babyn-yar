-- change the column type back to text
ALTER TABLE users ALTER COLUMN email TYPE text USING email::text;

