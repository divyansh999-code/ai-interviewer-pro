
import { createClient } from '@supabase/supabase-js';

// Use optional chaining to safely access env properties. 
// This prevents crashing if (import.meta as any).env is undefined.
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://qgqgkmpqslauakvaxcyl.supabase.co';
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_KEY || 'sb_publishable_ctb7WPPwSaSUq5vyMEPfug_STR9BS3G';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
