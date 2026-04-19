import { createClient } from '@supabase/supabase-js';

// Server-side only client — bypasses RLS using service_role key
// NEVER expose this on the client
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);
