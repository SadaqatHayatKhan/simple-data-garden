
import { createClient } from '@supabase/supabase-js';
import { type User, type Task } from '@/types';

// Use environment variables provided by the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify that environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure your Supabase project is correctly linked.');
}

// Create the Supabase client with more robust error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true
    }
  }
);

// Add a helper function to check if Supabase is properly connected
export const checkSupabaseConnection = async () => {
  try {
    // A simple ping that won't fail due to table not existing
    const { error } = await supabase.from('_dummy_query_for_connection_test_').select('*').limit(1).maybeSingle();
    
    // Specific error for table not found is fine - that means we connected to Supabase
    if (error && error.code === 'PGRST116') {
      return true;
    }
    
    // If no error with auth, we're connected
    const { error: authError } = await supabase.auth.getSession();
    return !authError;
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return false;
  }
};

// Check if we're in dev mode and show appropriate messages
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
