
import { createClient } from '@supabase/supabase-js';

// The Supabase URL and anon key are public values that can be exposed in the client
// These will need to be replaced with your actual Supabase URL and anon key
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
  user_id: string;
};
