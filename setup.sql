-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    guest_limit INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    rsvp_approval BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invites table
CREATE TABLE IF NOT EXISTS invites (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    guest_email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    user_id INTEGER REFERENCES users(id),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 