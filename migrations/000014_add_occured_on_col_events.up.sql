BEGIN;

ALTER TABLE events ADD COLUMN occured_on date;

UPDATE events
SET occured_on = created_at::date;

ALTER TABLE events
  ALTER COLUMN occured_on SET NOT NULL,
  ALTER COLUMN occured_on SET DEFAULT now();

COMMIT;
