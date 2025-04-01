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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invites table
CREATE TABLE IF NOT EXISTS invites (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
    id SERIAL PRIMARY KEY,
    invite_id INTEGER REFERENCES invites(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    response VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert test user (password: test123)
INSERT INTO users (email, password_hash, name) 
VALUES ('test@example.com', '$2b$10$YourHashedPasswordHere', 'Test User')
ON CONFLICT (email) DO NOTHING; 