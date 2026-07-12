import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export async function getServerSupabase() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  
  const globalHeaders: Record<string, string> = {};
  if (authHeader) {
    globalHeaders['authorization'] = authHeader;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: globalHeaders,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
