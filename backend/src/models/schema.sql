-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean rebuild with latest schema & defaults
DROP TABLE IF EXISTS team_progress CASCADE;
DROP TABLE IF EXISTS team_inventory CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS game_settings CASCADE;

-- Table for storing the teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_name VARCHAR(100) UNIQUE NOT NULL,
    auth_code VARCHAR(100) UNIQUE NOT NULL,
    remaining_years DECIMAL(10, 2) DEFAULT 10.0,
    standard_hints_left INT DEFAULT 3,
    current_island INT DEFAULT 1,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing the questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    island_id INT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('PRE_ROUND', 'MAIN')),
    format VARCHAR(50) NOT NULL CHECK (format IN ('MCQ', 'NON_MCQ')),
    question_text TEXT NOT NULL,
    hint_text TEXT,
    options JSONB, -- Stored as a JSON array of strings
    correct_answer VARCHAR(255) NOT NULL,
    hidden_wrong_answer VARCHAR(255),
    reward_years DECIMAL(10, 2) DEFAULT 0.0,
    penalty_years DECIMAL(10, 2) DEFAULT 0.0,
    difficulty_level INT DEFAULT 1,
    sequence_number INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking answered questions (mostly for non-sequential logic and audit)
CREATE TABLE IF NOT EXISTS team_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL, -- References a questions table later
    status VARCHAR(50) NOT NULL CHECK (status IN ('CORRECT', 'INCORRECT')),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for team inventory (active pre-round rewards)
CREATE TABLE IF NOT EXISTS team_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('ATHENAS_SCROLL', 'CYCLOPS_EYE', 'HERMES_SANDALS', 'THE_BLESSING')),
    is_used BOOLEAN DEFAULT false,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for global game settings (e.g. freeze submissions)
CREATE TABLE IF NOT EXISTS game_settings (
    key VARCHAR(50) PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO game_settings (key, value) VALUES ('is_frozen', 'false') ON CONFLICT (key) DO NOTHING;
