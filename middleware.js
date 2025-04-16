import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Get the pathname of the request
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Skip authentication for API routes and _next paths
  if (pathname.startsWith('/api/') || pathname.includes('/_next/') || 
      pathname.includes('/static/') || pathname.includes('/favicon.ico')) {
    return NextResponse.next();
  }

  // Check if the user has the authentication cookie
  const authCookie = request.cookies.get('auth');
  
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next();
  }

  // Check if this is the login page submission (POST to /login or root path with auth=login purpose)
  if ((pathname === '/login' || pathname === '/') && request.method === 'POST') {
    try {
      // Parse the request body 
      const body = await request.json();
      const { password } = body;
      
      // Check if the password is correct
      if (password === '1988@1988') {
        const response = NextResponse.redirect(new URL('/', request.url));
        
        // Set authentication cookie
        response.cookies.set('auth', 'authenticated', {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        
        return response;
      } else {
        // Password incorrect, return error response
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'An error occurred. Check if password is correct: 1988@1988' },
        { status: 500 }
      );
    }
  }

  // If path is /login, allow access
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Redirect to login for other paths
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 