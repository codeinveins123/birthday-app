import { createClient } from "@supabase/supabase-js";

const baseUrl = import.meta.env.VITE_SUPABASE_URL;
const baseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const base = createClient(baseUrl, baseKey);