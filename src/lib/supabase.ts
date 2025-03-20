
import { createClient } from '@supabase/supabase-js';
import { type User, type Task } from '@/types';

// Use environment variables provided by the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify that environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure your Supabase project is correctly linked.');
  // Provide fallback values so the app doesn't crash, but will show appropriate errors
  // You should replace these with proper error handling in production
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Add a helper function to check if Supabase is properly connected
export const checkSupabaseConnection = async () => {
  try {
    // Try a simple query to check connection
    const { error } = await supabase.from('tasks').select('count', { count: 'exact', head: true });
    return !error;
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return false;
  }
};
