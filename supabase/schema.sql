-- ElecZen Component Library Database Schema
-- Run this in your Supabase SQL Editor to create the necessary tables

-- 1. Component Libraries Table
-- Stores metadata about uploaded library files
CREATE TABLE IF NOT EXISTS component_libraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_path TEXT NOT NULL UNIQUE,
    library_type TEXT NOT NULL, -- 'ezc', 'ezl', 'spice', 'processed', etc.
    status TEXT DEFAULT 'ok', -- 'ok', 'error', 'processing'
    component_count INTEGER DEFAULT 0,
    parsed_metadata JSONB,
    is_public BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Library Index Table
-- Searchable index of individual components
CREATE TABLE IF NOT EXISTS library_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    library_id UUID REFERENCES component_libraries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- 'resistor', 'capacitor', 'ic', 'subckt', etc.
    category TEXT, -- 'Passive/Resistor', 'ICs/Timer', etc.
    parameters JSONB,
    pins JSONB,
    source_file TEXT,
    search_blob TEXT, -- Searchable text blob
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_library_index_name ON library_index(name);
CREATE INDEX IF NOT EXISTS idx_library_index_type ON library_index(type);
CREATE INDEX IF NOT EXISTS idx_library_index_category ON library_index(category);
CREATE INDEX IF NOT EXISTS idx_library_index_library_id ON library_index(library_id);
CREATE INDEX IF NOT EXISTS idx_component_libraries_user_id ON component_libraries(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE component_libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_index ENABLE ROW LEVEL SECURITY;

-- RLS Policies for component_libraries
-- Allow users to read all public libraries
CREATE POLICY "Public libraries are viewable by everyone"
    ON component_libraries FOR SELECT
    USING (is_public = true);

-- Allow users to read their own libraries
CREATE POLICY "Users can view their own libraries"
    ON component_libraries FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own libraries
CREATE POLICY "Users can insert their own libraries"
    ON component_libraries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own libraries
CREATE POLICY "Users can update their own libraries"
    ON component_libraries FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own libraries
CREATE POLICY "Users can delete their own libraries"
    ON component_libraries FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for library_index
-- Allow reading from public libraries
CREATE POLICY "Public library components are viewable"
    ON library_index FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM component_libraries
            WHERE component_libraries.id = library_index.library_id
            AND component_libraries.is_public = true
        )
    );

-- Allow reading from user's own libraries
CREATE POLICY "Users can view their own library components"
    ON library_index FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM component_libraries
            WHERE component_libraries.id = library_index.library_id
            AND component_libraries.user_id = auth.uid()
        )
    );

-- Allow inserting into user's own libraries
CREATE POLICY "Users can insert into their own libraries"
    ON library_index FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM component_libraries
            WHERE component_libraries.id = library_index.library_id
            AND component_libraries.user_id = auth.uid()
        )
    );

-- Allow updating user's own library components
CREATE POLICY "Users can update their own library components"
    ON library_index FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM component_libraries
            WHERE component_libraries.id = library_index.library_id
            AND component_libraries.user_id = auth.uid()
        )
    );

-- Allow deleting user's own library components
CREATE POLICY "Users can delete their own library components"
    ON library_index FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM component_libraries
            WHERE component_libraries.id = library_index.library_id
            AND component_libraries.user_id = auth.uid()
        )
    );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_component_libraries_updated_at
    BEFORE UPDATE ON component_libraries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
-- These might not be needed depending on your Supabase configuration
-- GRANT ALL ON component_libraries TO authenticated;
-- GRANT ALL ON library_index TO authenticated;
