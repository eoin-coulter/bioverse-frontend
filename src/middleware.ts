import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Cookies from 'js-cookie';
import { User } from './app/models/User';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let parsedUser:User| null = null;

    // Retrieve the "isAdmin" cookie
    const user = request.cookies.get('user')?.value
    
    if(user){ parsedUser = JSON.parse(user)}

    // If user is trying to access /admin-page and is not an admin, redirect to login
    if (request.nextUrl.pathname === '/admin-page') {
      if (!parsedUser || !parsedUser.isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));  // Redirect non-admins to login
      }
    } else {
  
      if(!user){
        return NextResponse.redirect(new URL('/login', request.url)); 
      }
      // If you want to do more checks for dashboard, you can add logic here
    }
  
    // Allow the request to continue if no redirects are triggered
    return NextResponse.next();
  }
  
  export const config = {
    matcher: ['/questionnaires', '/admin-page'], // Specify routes to protect
  };