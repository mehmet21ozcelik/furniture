import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Basic DB check to ensure connection is alive
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: 'Database connection failed' }, { status: 503 });
    }
}
