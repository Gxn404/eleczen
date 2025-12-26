# Component Library Database Setup

## Overview
This document explains how to set up the Supabase database tables for the ElecZen component library system.

## Prerequisites
- Supabase project created
- Access to Supabase SQL Editor

## Setup Instructions

### 1. Run the Schema SQL

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute

This will create:
- `component_libraries` table - Stores library metadata
- `library_index` table - Searchable component index
- Proper indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp triggers

### 2. Create Storage Bucket

1. Navigate to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name it: `libraries`
4. Set it to **Private** (or Public if you want)
5. Click **Create Bucket**

### 3. Set Storage Policies

In the Storage section, add these policies for the `libraries` bucket:

**Policy 1: Allow authenticated users to upload**
```sql
CREATE POLICY "Authenticated users can upload libraries"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'libraries');
```

**Policy 2: Allow authenticated users to read**
```sql
CREATE POLICY "Authenticated users can read libraries"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'libraries');
```

**Policy 3: Allow users to delete their own files**
```sql
CREATE POLICY "Users can delete their own library files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'libraries' AND auth.uid() = owner);
```

### 4. Verify Setup

Run this query to verify the tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('component_libraries', 'library_index');
```

You should see both tables listed.

## Database Schema

### component_libraries
Stores metadata about uploaded library files.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| file_path | TEXT | Path in storage bucket |
| library_type | TEXT | Type: 'ezc', 'ezl', 'spice', etc. |
| status | TEXT | 'ok', 'error', 'processing' |
| component_count | INTEGER | Number of components |
| parsed_metadata | JSONB | Additional metadata |
| is_public | BOOLEAN | Public visibility |
| user_id | UUID | Owner user ID |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### library_index
Searchable index of individual components.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| library_id | UUID | Foreign key to component_libraries |
| name | TEXT | Component name |
| type | TEXT | Component type |
| category | TEXT | Component category |
| parameters | JSONB | Component parameters |
| pins | JSONB | Pin configuration |
| source_file | TEXT | Original source file |
| search_blob | TEXT | Searchable text |
| created_at | TIMESTAMP | Creation time |

## Usage

Once set up, the system will:

1. **Upload**: Users upload `.kicad_sym`, `.lib`, `.sub`, or `.zip` files
2. **Process**: Files are processed into `.ezc`, `.ezl`, and `.svg` formats
3. **Store**: Processed files are stored in the `libraries` bucket
4. **Index**: Component metadata is indexed in `library_index` table
5. **Browse**: Components appear in the LibraryBrowser automatically
6. **Place**: Users can place components on the canvas with real SVG symbols

## Troubleshooting

### Error: "relation 'library_index' does not exist"
- Run the schema SQL in Supabase SQL Editor
- Verify tables exist with the verification query above

### Error: "new row violates row-level security policy"
- Check that RLS policies are created
- Ensure user is authenticated
- Verify `user_id` is set correctly in uploads

### Components not showing in LibraryBrowser
- Check browser console for errors
- Verify data exists: `SELECT * FROM library_index LIMIT 10;`
- Check RLS policies allow reading

### Upload fails
- Verify storage bucket `libraries` exists
- Check storage policies allow uploads
- Ensure user is authenticated

## Security Notes

- RLS is enabled by default
- Users can only see their own private libraries
- Public libraries are visible to all authenticated users
- Storage policies prevent unauthorized access

## Next Steps

After setup:
1. Test by uploading a component library
2. Verify it appears in the LibraryBrowser
3. Try placing a component on the canvas
4. Check that SVG symbols render correctly
