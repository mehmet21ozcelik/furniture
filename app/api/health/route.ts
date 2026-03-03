import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Database ping timeout')), 5000);
        });

        // Use a robust ping query that checks actual connection state without relying on table data
        const pingPromise = prisma.$queryRaw`SELECT 1 as ping`;

        await Promise.race([pingPromise, timeoutPromise]);

        return NextResponse.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() }, { status: 200 });
    } catch (error: any) {
        console.error('Health check failed:', error);
        return NextResponse.json({ status: 'error', database: 'disconnected', message: error.message || 'Database connection failed' }, { status: 503 });
    }
}
