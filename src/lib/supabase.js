import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://buqzumrtrksoymzaddvq.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cXp1bXJ0cmtzb3ltemFkZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDg0NTgsImV4cCI6MjA3OTkyNDQ1OH0.edamDioXNxhQyZsseGWk-GwHGB6YWQPt7bZ-dxLGqXk';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase environment variables are missing. ' +
    'Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env.local'
  );
}

// Create a Supabase client for client-side or server-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
