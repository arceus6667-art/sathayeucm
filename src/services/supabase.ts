import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqeplhjtkggsohbwmqhx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZXBsaGp0a2dnc29oYndtcWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzkzODIsImV4cCI6MjA1NjgxNTM4Mn0.demoPlaceholderKey';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.warn('[Supabase Init Warning]:', e);
    }
  }
  return supabaseInstance;
}

export const isSupabaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY && 
    !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('demoPlaceholderKey')
  );
};
