import { createClient } from '@supabase/supabase-js';
require('dotenv').config({ path: '.env.local' });

const supabaseMainUrl = process.env.SUPABASE_URL || 'https://buqzumrtrksoymzaddvq.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cXp1bXJ0cmtzb3ltemFkZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDg0NTgsImV4cCI6MjA3OTkyNDQ1OH0.edamDioXNxhQyZsseGWk-GwHGB6YWQPt7bZ-dxLGqXk';

if (!supabaseMainUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase Service Role Key');
}

export const supabaseAdmin = createClient(supabaseMainUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
