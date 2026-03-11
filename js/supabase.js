const SUPABASE_URL = 'https://irysuvjskommhaaarvps.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeXN1dmpza29tbWhhYWFydnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzM0MTYsImV4cCI6MjA4ODgwOTQxNn0.y39g1bcT-fpRfgMhNTsF1O5M3uAtKqAocBScAwIOj_0';

// Supabase client initialization for static frontend (GitHub Pages compatible).
// IMPORTANT: only public anon key is used here, never service_role.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
