import { createClient } from '@supabase/supabase-js';
import { env } from '@/shared/lib/env';

export const supabaseClient = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// 서버 전용 (클라이언트에서는 null)
export const supabaseServer = env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;
