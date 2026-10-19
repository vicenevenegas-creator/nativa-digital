import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zoliwvbtctzlfjxjlpmu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbGl3dmJ0Y3R6bGZqeGpscG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NzE3NzYsImV4cCI6MjEwNDU0Nzc3Nn0.6cJzCDWv1xPbkrdOOqD7MTHEJguADxxGZW8lLsipr5I';

// Flujo PKCE: Supabase vuelve a /auth/callback?code=... y App.jsx hace el intercambio
// del código por la sesión (exchangeCodeForSession) antes de llevar al usuario a #home.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: false
  }
});

// Ruta de retorno para OAuth y para el enlace de confirmación del correo de registro.
// El destino va como texto ("home") y no como "/#home": lo que sigue a "#" no viaja al callback.
export const AUTH_CALLBACK_URL = `${window.location.origin}/auth/callback?next=home`;
