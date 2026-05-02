ALTER TABLE rsvp_submissions
ADD COLUMN IF NOT EXISTS guest_names JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE rsvp_submissions
ADD COLUMN IF NOT EXISTS contact_message TEXT NOT NULL DEFAULT '';
