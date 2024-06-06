CREATE TABLE IF NOT EXISTS assets (
  id bigserial PRIMARY KEY,
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  url TEXT NOT NULL,
  file_name TEXT NOT NULL
);
