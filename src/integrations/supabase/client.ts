
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ojcnhqymerxxcdftgqln.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qY25ocXltZXJ4eGNkZnRncWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Nzc5MjMsImV4cCI6MjA1ODE1MzkyM30.gaYyfTi8pCovTnrHNX0smU8iKf6wiIxvaw4PWslusyk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (url, options) => fetch(url, options)
    },
    db: {
      schema: 'public'
    }
  }
);
