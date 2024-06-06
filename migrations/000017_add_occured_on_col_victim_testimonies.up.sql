BEGIN;

ALTER TABLE victim_testimonies ADD COLUMN occured_on date;

UPDATE victim_testimonies
SET occured_on = created_at::date;

ALTER TABLE victim_testimonies
  ALTER COLUMN occured_on SET NOT NULL,
  ALTER COLUMN occured_on SET DEFAULT now();

COMMIT;


