BEGIN;

ALTER TABLE books ADD COLUMN occured_on date;

UPDATE books
SET occured_on = created_at::date;

ALTER TABLE books
  ALTER COLUMN occured_on SET NOT NULL,
  ALTER COLUMN occured_on SET DEFAULT now();

COMMIT;

