import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { password } = body;
    
    // Check if the password is correct
    if (password === '1988@1988') {
      const response = NextResponse.json({ success: true });
      
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
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
} 