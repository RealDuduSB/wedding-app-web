# Backend Integration Setup Guide

This guide will help you set up the Supabase backend for the wedding website RSVP functionality.

## Overview

The backend integration includes:
- ✅ Supabase client configuration (`src/lib/supabase.ts`)
- ✅ Database schema and migration (`supabase/migrations/001_create_rsvp_submissions.sql`)
- ✅ RSVP API route with validation (`src/app/api/rsvp/route.ts`)
- ✅ TypeScript types for RSVP data (`src/types/index.ts`)

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. A Supabase project created
3. Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - **Name**: `wedding-website` (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to your users
5. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Copy the contents from `.env.example`
3. Replace the Supabase values with your actual credentials:

```bash
# Backend Service (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Maps API (configure later)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Wedding Configuration
NEXT_PUBLIC_WEDDING_DATE=2024-12-15T16:00:00-03:00
NEXT_PUBLIC_CEREMONY_LAT=-23.550520
NEXT_PUBLIC_CEREMONY_LNG=-46.633308
NEXT_PUBLIC_CEREMONY_ADDRESS=Endereço completo da cerimônia
```

## Step 4: Run Database Migration

### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/migrations/001_create_rsvp_submissions.sql`
5. Copy all the SQL code
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see "Success. No rows returned"

### Option B: Using Supabase CLI (For Developers)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project (get project ref from dashboard URL):
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push the migration:
   ```bash
   supabase db push
   ```

## Step 5: Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see a table named `rsvp_submissions`
3. Click on it to view the schema
4. Verify the columns match the design:
   - id (uuid)
   - name (varchar)
   - phone (varchar)
   - email (varchar)
   - number_of_guests (int4)
   - dietary_restrictions (text)
   - created_at (timestamptz)
   - updated_at (timestamptz)

## Step 6: Test the API Route

### Start the Development Server

```bash
npm run dev
```

### Test with curl (Command Line)

```bash
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Guest",
    "phone": "(11) 98765-4321",
    "email": "test@example.com",
    "numberOfGuests": 2,
    "dietaryRestrictions": "Vegetarian"
  }'
```

Expected response:
```json
{
  "message": "Presença confirmada com sucesso!",
  "data": {
    "id": "uuid-here",
    "name": "Test Guest",
    "numberOfGuests": 2
  }
}
```

### Test with Browser Console

1. Open your browser to `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run this code:

```javascript
fetch('/api/rsvp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test Guest',
    phone: '(11) 98765-4321',
    email: 'test@example.com',
    numberOfGuests: 2,
    dietaryRestrictions: 'Vegetarian'
  })
})
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### Verify in Supabase

1. Go to Supabase dashboard → **Table Editor**
2. Click on `rsvp_submissions` table
3. You should see your test record

## Step 7: Test Validation

Test that validation works by sending invalid data:

```javascript
// Test invalid email
fetch('/api/rsvp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    phone: '(11) 98765-4321',
    email: 'invalid-email',
    numberOfGuests: 2
  })
})
  .then(res => res.json())
  .then(data => console.log('Validation error:', data));
```

Expected response:
```json
{
  "error": "Dados inválidos",
  "validationErrors": {
    "email": "Formato de e-mail inválido"
  }
}
```

## API Validation Rules

The API validates the following:

| Field | Validation Rules |
|-------|------------------|
| **name** | Required, minimum 2 characters |
| **phone** | Required, valid Brazilian phone format |
| **email** | Required, valid email format |
| **numberOfGuests** | Required, integer between 1-10 |
| **dietaryRestrictions** | Optional, maximum 500 characters |

## Error Handling

The API returns appropriate HTTP status codes:

| Status Code | Meaning |
|-------------|---------|
| 201 | Success - RSVP created |
| 400 | Bad Request - Invalid data or validation errors |
| 405 | Method Not Allowed - Only POST is supported |
| 409 | Conflict - Duplicate email (if unique constraint added) |
| 500 | Server Error - Database or connection error |

## Security Features

✅ **Row Level Security (RLS)**: Enabled on the database table
✅ **Public Insert Policy**: Allows anonymous users to submit RSVPs
✅ **Server-side Validation**: All data validated before database insertion
✅ **SQL Injection Protection**: Using Supabase parameterized queries
✅ **Environment Variables**: Sensitive credentials stored securely

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution**: Make sure `.env.local` exists and contains valid Supabase credentials. Restart the dev server after adding environment variables.

### Error: "relation 'rsvp_submissions' does not exist"

**Solution**: The database migration hasn't been run. Follow Step 4 to create the table.

### Error: "new row violates row-level security policy"

**Solution**: The RLS policy isn't configured correctly. Re-run the migration SQL, especially the policy creation section.

### Error: "Failed to fetch" or Network Error

**Solution**: 
1. Check that the dev server is running (`npm run dev`)
2. Verify Supabase credentials in `.env.local`
3. Check Supabase project status in the dashboard

### Validation Errors Not Showing

**Solution**: Check the browser console for the full error response. The API returns detailed validation errors in the `validationErrors` field.

## Next Steps

Now that the backend is set up, you can:

1. ✅ Implement the RSVP form component (Task 6)
2. ✅ Connect the form to the API route
3. ✅ Add success/error message display
4. ✅ Test the complete RSVP flow

## Database Management

### View All RSVPs

In Supabase dashboard:
1. Go to **Table Editor**
2. Click `rsvp_submissions`
3. View all submissions

### Export RSVPs

1. In Table Editor, click the table
2. Click the **Export** button (top right)
3. Choose CSV or JSON format

### Delete Test Data

```sql
DELETE FROM rsvp_submissions WHERE email LIKE '%test%';
```

## Production Deployment

When deploying to production (Vercel):

1. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add other required variables

2. Redeploy the application

3. Test the production API endpoint

## Support

For more information:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Project README](./README.md)
