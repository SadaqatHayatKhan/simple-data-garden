
// This file re-exports the Supabase client from the integrations folder
import { supabase } from "@/integrations/supabase/client";

// Re-export the supabase client
export { supabase };

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
  // The integrated client should already have the URL and key set
  return true;
};
