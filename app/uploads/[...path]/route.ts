import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    const relativePath = params.path.join('/');
    // Check for directory traversal attempts
    if (relativePath.includes('..') || relativePath.startsWith('/')) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', ...params.path);

    try {
        if (!fs.existsSync(filePath)) {
            return new NextResponse('Not Found', { status: 404 });
        }

        const file = fs.readFileSync(filePath);
        const ext = path.extname(filePath).slice(1).toLowerCase();

        let mime = 'application/octet-stream';
        if (ext === 'webp') mime = 'image/webp';
        else if (ext === 'jpeg' || ext === 'jpg') mime = 'image/jpeg';
        else if (ext === 'png') mime = 'image/png';
        else if (ext === 'svg') mime = 'image/svg+xml';
        else if (ext === 'avif') mime = 'image/avif';
        else if (ext === 'gif') mime = 'image/gif';

        return new NextResponse(file, {
            headers: {
                'Content-Type': mime,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (e) {
        console.error('Error serving static file:', e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
