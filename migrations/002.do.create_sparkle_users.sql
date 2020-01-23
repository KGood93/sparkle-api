CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sparkle_users (
  userId uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  userName TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP
);

