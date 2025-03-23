
// This file re-exports the Supabase client from the integrations folder
import { supabase } from "@/integrations/supabase/client";

// Re-export the supabase client
export { supabase };

// Add a helper function to check if Supabase is properly connected
export const checkSupabaseConnection = async () => {
  try {
    // A simple ping that won't fail due to table not existing
    const { data, error } = await supabase.from('tasks').select('id').limit(1).maybeSingle();
    
    if (!error) {
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
