import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Retrieve the "isAdmin" cookie
    const isAdminCookie = request.cookies.get('isAdmin');

    // If user is trying to access /admin-page and is not an admin, redirect to login
    if (request.nextUrl.pathname === '/admin-page') {
      if (!isAdminCookie || isAdminCookie.value !== 'true') {
        return NextResponse.redirect(new URL('/login', request.url));  // Redirect non-admins to login
      }
    }
  
    // You can also protect other routes like /dashboard
    if (request.nextUrl.pathname === '/dashboard') {
      // If you want to do more checks for dashboard, you can add logic here
    }
  
    // Allow the request to continue if no redirects are triggered
    return NextResponse.next();
  }
  
  export const config = {
    matcher: ['/dashboard', '/admin-page'], // Specify routes to protect
  };