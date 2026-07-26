import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isUpdatePasswordPage = request.nextUrl.pathname === '/auth/update-password';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Skip middleware for API routes
  if (isApiRoute) {
    return supabaseResponse;
  }

  // Waitlist Mode: If enabled, lock down the entire site and redirect to /waitlist
  const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';
  const isWaitlistPage = request.nextUrl.pathname.startsWith('/waitlist');
  const isPublicMarketingPage = ['/features', '/about', '/support', '/docs'].some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isWaitlistMode && !isWaitlistPage && !isPublicMarketingPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/waitlist';
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages (except update-password and verify-email)
  const isVerifyEmailPage = request.nextUrl.pathname.startsWith('/auth/verify-email');
  if (user && isAuthPage && !isUpdatePasswordPage && !isVerifyEmailPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Redirect non-logged-in users away from protected pages
  if (!user && (isDashboardPage || isOnboardingPage || isUpdatePasswordPage)) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
