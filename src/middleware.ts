import { NextResponse, NextRequest } from 'next/server'
import { authRoutes, protectedRouted } from './lib/routes'
import { formbuildersessionName } from './actions/auth'
 

// This function can be marked async if using await inside
export default function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home', request.url))
    const {nextUrl} = request
    const isProtectedRoute = protectedRouted.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    const cookievalue =  request.cookies.get(formbuildersessionName)?.value 
    const isLoggedin =  cookievalue !== undefined && cookievalue !== ''
    // console.log("is user logged in", isLoggedin)

    // If the user is trying to acess a protectedRoute and they are not logged in, redirect them to the register page
    if(isProtectedRoute && !isLoggedin){
        return NextResponse.redirect(new URL('/sign-in', nextUrl))

    }
    if(isAuthRoute && isLoggedin) {
        return NextResponse.redirect(new URL('/', nextUrl))
    }


    
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.\\.png$).)']
}