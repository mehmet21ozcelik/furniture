import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { loginSchema } from '@/lib/validations/auth';
import { rateLimit } from '@/lib/auth/rate-limit';

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

        if (!rateLimit(ip)) {
            return NextResponse.json(
                { message: 'Çok fazla deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: 'Geçersiz bilgiler', errors: result.error.errors },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'E-posta veya şifre hatalı' },
                { status: 401 }
            );
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'E-posta veya şifre hatalı' },
                { status: 401 }
            );
        }

        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Sadece yöneticiler giriş yapabilir' },
                { status: 403 }
            );
        }

        const token = await signToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json({ success: true, message: 'Giriş başarılı' });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: false, // Force false for HTTP-only production IP
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
}
