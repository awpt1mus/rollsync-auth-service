CREATE DATABASE "rollsync-auth-db"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

\c rollsync-auth-db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists public.user(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    firstname varchar(200) not null,
    lastname varchar(200),
    username varchar(20),
    email varchar(250) not null unique,
    password text,
    google_id varchar(250),
    verified boolean default 'false',
    attempts integer default 0,
    avatar_url text, 
    created_at timestamptz default CURRENT_TIMESTAMP,
    updated_at timestamptz default CURRENT_TIMESTAMP
);

ALTER TABLE public.user
    ADD CONSTRAINT unique_nullable_username_constraint UNIQUE (username);

-- Unique index on the column where the value is not NULL
CREATE UNIQUE INDEX unique_non_null_nullable_username_index 
    ON public.user (username)
    WHERE username IS NOT NULL;

create table if not exists public.refresh_token(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    value text not null unique,
    expiry timestamptz not null,
);

