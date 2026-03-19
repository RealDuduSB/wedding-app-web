# Supabase Database Setup

This directory contains SQL migrations for the wedding website database.

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `migrations/001_create_rsvp_submissions.sql`
4. Paste and run the SQL in the editor
5. Verify the table was created in the Table Editor

### Option 2: Using Supabase CLI (Recommended for Development)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

## Database Schema

### Table: `rsvp_submissions`

Stores wedding RSVP form submissions from guests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier (auto-generated) |
| name | VARCHAR(255) | NOT NULL | Guest's full name |
| phone | VARCHAR(20) | NOT NULL | Contact phone number |
| email | VARCHAR(255) | NOT NULL | Contact email address |
| number_of_guests | INTEGER | NOT NULL, CHECK (1-10) | Number of attendees |
| dietary_restrictions | TEXT | NULLABLE | Optional dietary notes |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Submission timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

### Indexes

- `idx_rsvp_email`: Index on email column for faster lookups
- `idx_rsvp_created_at`: Index on created_at column (descending) for chronological queries

### Row Level Security (RLS)

The table has RLS enabled with the following policies:

1. **Allow public inserts**: Anonymous users can submit RSVPs (for the public form)
2. **Allow authenticated reads**: Authenticated users can view all RSVPs (for the couple)
3. **Allow service role full access**: Service role has complete access

### Triggers

- **update_rsvp_submissions_updated_at**: Automatically updates the `updated_at` column on row updates

## Verification

After running the migration, verify the setup:

1. Check that the table exists:
   ```sql
   SELECT * FROM rsvp_submissions LIMIT 1;
   ```

2. Verify indexes:
   ```sql
   SELECT indexname, indexdef 
   FROM pg_indexes 
   WHERE tablename = 'rsvp_submissions';
   ```

3. Check RLS policies:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'rsvp_submissions';
   ```

## Testing

You can test the table by inserting a sample record:

```sql
INSERT INTO rsvp_submissions (name, phone, email, number_of_guests, dietary_restrictions)
VALUES ('Test Guest', '+55 11 98765-4321', 'test@example.com', 2, 'Vegetarian');
```

Then verify it was inserted:

```sql
SELECT * FROM rsvp_submissions ORDER BY created_at DESC LIMIT 1;
```

## Troubleshooting

### Error: "relation already exists"

If you see this error, the table already exists. You can either:
- Drop the existing table: `DROP TABLE IF EXISTS rsvp_submissions CASCADE;`
- Or skip this migration

### Error: "permission denied"

Make sure you're using the correct Supabase credentials and have the necessary permissions.

### RLS Blocking Inserts

If anonymous inserts are blocked, verify the RLS policy:
```sql
SELECT * FROM pg_policies WHERE tablename = 'rsvp_submissions' AND policyname = 'Allow public inserts';
```
