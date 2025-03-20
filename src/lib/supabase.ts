
import { createClient } from '@supabase/supabase-js';
import { type User, type Task } from '@/types';

// Use environment variables provided by the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// We're using the types from the types directory now, so we don't need these duplicated types
