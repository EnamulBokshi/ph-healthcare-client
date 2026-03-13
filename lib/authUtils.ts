import { UserRole } from "@/types/auth.types";

export const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
];


export const isAuthRoute = (path: string): boolean => {
    return authRoutes.some((route:string) => route === path);
}


export type RouteConfig = {
    exact: string[],
    pattern: RegExp[],
}

export const commonProtectedRoutes: RouteConfig = {
    exact: ['/my-profile', '/change-password'],
    pattern: []
}

export const doctorProtectedRoutes: RouteConfig = {
    pattern: [/^\/doctor\/dashboard/], // Matches any path that starts with /doctor/dashboard
    exact: []
}

export const adminOrSuperAdminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin\/dashboard/], // Matches any path that starts with /admin/dashboard
    exact: []
}
export const patientProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: ["/payments/success"]
}


export const isRouteMatches = (pathName: string, routes: RouteConfig): boolean => {
    const { exact, pattern } = routes;
    if(exact.includes(pathName)) {
        return true;
    }
    return pattern.some((regex: RegExp) => regex.test(pathName));
}


export const getRouteOwner = (pathName: string): UserRole | null | 'COMMON' => {
    if(isRouteMatches(pathName, commonProtectedRoutes)) {
        return 'COMMON';
    }
    if(isRouteMatches(pathName, doctorProtectedRoutes)) {
        return UserRole.DOCTOR;
    }
    if(isRouteMatches(pathName, adminOrSuperAdminProtectedRoutes)) {
        return UserRole.ADMIN;
    }
    if(isRouteMatches(pathName, patientProtectedRoutes)) {
        return UserRole.PATIENT;
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    switch(role) {
        case UserRole.DOCTOR:
            return '/doctor/dashboard';
        case UserRole.ADMIN:
            return '/admin/dashboard';
        case UserRole.PATIENT:
            return '/dashboard';
        default:
            return '/';
    }
}

export const isValidRedirectPath = (redirectPath: string, role: UserRole) => {
    role = role === UserRole.SUPER_ADMIN ? UserRole.ADMIN : role; // Treat SUPER_ADMIN as ADMIN for redirect purposes
    const routeOwner = getRouteOwner(redirectPath);
    
    if(!routeOwner || routeOwner === 'COMMON') {
        return true; // Allow redirect to public routes
    }
    if(routeOwner === role) {
        return true;
    }
    return false;
}