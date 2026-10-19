import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zoliwvbtctzlfjxjlpmu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbGl3dmJ0Y3R6bGZqeGpscG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NzE3NzYsImV4cCI6MjEwNDU0Nzc3Nn0.6cJzCDWv1xPbkrdOOqD7MTHEJguADxxGZW8lLsipr5I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
