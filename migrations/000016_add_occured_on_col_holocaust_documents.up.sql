BEGIN;

ALTER TABLE holocaust_documents ADD COLUMN occured_on date;

UPDATE holocaust_documents
SET occured_on = created_at::date;

ALTER TABLE holocaust_documents
  ALTER COLUMN occured_on SET NOT NULL,
  ALTER COLUMN occured_on SET DEFAULT now();

COMMIT;


