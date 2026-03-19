-- Create rsvp_submissions table
CREATE TABLE IF NOT EXISTS rsvp_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0 AND number_of_guests <= 10),
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rsvp_email ON rsvp_submissions(email);
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp_submissions(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rsvp_submissions_updated_at
  BEFORE UPDATE ON rsvp_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for RSVP form submissions)
CREATE POLICY "Allow public inserts" ON rsvp_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all records
-- (This is for the couple to view RSVPs - requires authentication)
CREATE POLICY "Allow authenticated reads" ON rsvp_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access" ON rsvp_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE rsvp_submissions IS 'Stores wedding RSVP form submissions from guests';
COMMENT ON COLUMN rsvp_submissions.id IS 'Unique identifier for each RSVP submission';
COMMENT ON COLUMN rsvp_submissions.name IS 'Full name of the guest';
COMMENT ON COLUMN rsvp_submissions.phone IS 'Contact phone number (Brazilian format preferred)';
COMMENT ON COLUMN rsvp_submissions.email IS 'Contact email address';
COMMENT ON COLUMN rsvp_submissions.number_of_guests IS 'Number of guests attending (1-10)';
COMMENT ON COLUMN rsvp_submissions.dietary_restrictions IS 'Optional dietary restrictions or special requirements';
COMMENT ON COLUMN rsvp_submissions.created_at IS 'Timestamp when the RSVP was submitted';
COMMENT ON COLUMN rsvp_submissions.updated_at IS 'Timestamp when the RSVP was last updated';
