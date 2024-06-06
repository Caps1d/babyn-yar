CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  version integer NOT NULL DEFAULT 1
);
