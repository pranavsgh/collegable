// Initializes and exports the shared Supabase client used across the entire frontend
import { createClient } from '@supabase/supabase-js'

// Both values come from Vite env vars (prefixed VITE_ to be exposed to the browser bundle)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Single instance — import this instead of calling createClient anywhere else
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
