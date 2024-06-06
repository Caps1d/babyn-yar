CREATE TABLE IF NOT EXISTS books (
  id bigserial PRIMARY KEY,
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  lang text NOT NULL,
  cover text NOT NULL,
  documents text[] NOT NULL DEFAULT '{}',
  version integer NOT NULL DEFAULT 1,
  user_id bigint NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

