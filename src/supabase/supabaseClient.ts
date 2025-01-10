import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pqqaslokhbmcnhqymfdb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcWFzbG9raGJtY25ocXltZmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMjUwNjcsImV4cCI6MjA1MTgwMTA2N30.htMfw6GvvuyJ-oD0sEeLMj_yG3YIEMFwtI1XoE4ZhQg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
