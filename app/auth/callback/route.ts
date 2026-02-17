import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (code) {
    // The Supabase client will handle the code exchange automatically
    // when redirected from Google OAuth
    // Just redirect to home, the auth state will be updated by onAuthStateChange
    return NextResponse.redirect(new URL(next, request.url))
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login', request.url))
}
