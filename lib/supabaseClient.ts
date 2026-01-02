
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qgqgkmpqslauakvaxcyl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ctb7WPPwSaSUq5vyMEPfug_STR9BS3G';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
