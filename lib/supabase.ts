import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lbcpxjzbdvfkkdpzxrqv.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_GpP8ZGQ5eHBomG9G6JQgbQ_g3ZImzpj";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
