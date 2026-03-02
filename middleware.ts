import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api')) {
        // Allow public API routes if any (health, etc.)
        if (request.nextUrl.pathname.startsWith('/api/health') || request.nextUrl.pathname.startsWith('/api/auth')) {
            return NextResponse.next();
        }

        if (request.nextUrl.pathname === '/admin/login') {
            if (token) {
                const payload = await verifyToken(token);
                if (payload) {
                    return NextResponse.redirect(new URL('/admin', request.url));
                }
            }
            return NextResponse.next();
        }

        if (!token) {
            // For API requests, return 401 instead of redirect
            if (request.nextUrl.pathname.startsWith('/api')) {
                return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            if (request.nextUrl.pathname.startsWith('/api')) {
                return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    // Handle public /login route as alias for /admin/login
    if (request.nextUrl.pathname === '/login') {
        if (token) {
            const payload = await verifyToken(token);
            if (payload) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }
        // Render the login page (could be the same file or rewritten)
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*', '/login'],
};
