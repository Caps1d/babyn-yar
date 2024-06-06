ALTER TABLE events
  ADD COLUMN user_id bigint NOT NULL,
  ADD FOREIGN KEY (user_id) REFERENCES users(id);
