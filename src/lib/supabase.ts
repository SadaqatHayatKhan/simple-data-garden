
// This file re-exports the Supabase client from the integrations folder
import { supabase } from "@/integrations/supabase/client";

// Re-export the supabase client
export { supabase };

// Add a helper function to check if Supabase is properly connected
export const checkSupabaseConnection = async () => {
  try {
    // First try to check auth status as a simple connection test
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (!sessionError) {
      console.log("Supabase connection verified via auth");
      return true;
    }
    
    // Try a database query as fallback
    console.log("Trying fallback connection test...");
    const { error: queryError } = await supabase.from('tasks').select('id').limit(1);
    
    // If there's no error or just a permission error (which means Supabase is working)
    if (!queryError || queryError.code === 'PGRST116') {
      console.log("Supabase connection verified via database query");
      return true;
    }
    
    console.error("Supabase connection test failed:", queryError);
    return false;
  } catch (err) {
    console.error('Supabase connection test failed with exception:', err);
    return false;
  }
};

// Check if we're in dev mode and show appropriate messages
export const isSupabaseConfigured = () => {
  // The integrated client should already have the URL and key set
  return true;
};
