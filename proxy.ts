import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import { UserRole } from "./types/auth.types";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute } from "./lib/authUtils";

export async function proxy(request: NextRequest) {

console.log("Proxy middleware called for URL:", request);

try {
    const {pathname} = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const token = request.cookies.get('better-auth.session-token')?.value;
    const decodedAccessToken =  jwtUtils.verifyToken(accessToken as string, process.env.JWT_ACCESS_SECRET as string).data
    const isValidAccessToken = accessToken &&  jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET || '').success;
    
        let userRole:UserRole | null | 'COMMON' = null;

    if(isValidAccessToken && decodedAccessToken) {
        userRole = decodedAccessToken.role as UserRole;
    }
    const routeOwner = getRouteOwner(pathname);

    userRole = userRole === UserRole.SUPER_ADMIN ? UserRole.ADMIN : userRole;

    const isAuth = isAuthRoute(pathname);

    // Rule-1: If the route is an auth route and user is authenticated, redirect to dashboard (prevents accessing login/signup page when already logged in)
    if(isAuth && isValidAccessToken) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    // Rule-2: allow user to access public routes
    if(!routeOwner) {
        return NextResponse.next();
    }

    // Rule-3: If the route is protected and user is not authenticated, redirect to login page
    if(!accessToken || !isValidAccessToken){
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);

        return NextResponse.redirect(loginUrl);
    }

    // Rule-4: allow access common protected routes to any authenticated user
    if(routeOwner === 'COMMON') {
        return NextResponse.next();
    }

    // Rule-5: User trying to visit role based protected route, check if user's role matches the route's required role
    if(routeOwner !== userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    // Rule-6: If user's role matches the route's required role, allow access
    return NextResponse.next();



} catch (error) {
    console.error("Error in proxy middleware:", error);
     return new Response("Internal Server Error", { status: 500 });
}
}


export const config = {

    matcher: [

         /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}