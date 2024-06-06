CREATE TABLE IF NOT EXISTS victims (
  id bigserial PRIMARY KEY,
  full_name text NOT NULL,
  info text,
  version integer NOT NULL DEFAULT 1
);
