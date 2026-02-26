-- Create component_notes table
CREATE TABLE IF NOT EXISTS component_notes (
  id SERIAL PRIMARY KEY,
  component_name VARCHAR(255) NOT NULL,
  note_text TEXT NOT NULL,
  author_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_component_name ON component_notes(component_name);
CREATE INDEX IF NOT EXISTS idx_created_at ON component_notes(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_component_notes_updated_at BEFORE UPDATE
ON component_notes FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
