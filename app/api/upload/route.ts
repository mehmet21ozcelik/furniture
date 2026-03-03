import { NextRequest, NextResponse } from 'next/server';
import { ImageProcessor } from '@/lib/image/processor';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Simple Rate Limit Implementation (In-memory)
const uploadRateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10; // Max 10 images per 15 minutes

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = uploadRateLimit.get(ip);

    if (!record) {
        uploadRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (now > record.resetTime) {
        uploadRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= MAX_REQUESTS) {
        return false;
    }

    record.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for") || 'unknown-ip';

        if (!checkRateLimit(ip)) {
            return NextResponse.json({ success: false, error: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'Dosya bulunamadı' }, { status: 400 });
        }

        // 1. File Size Validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, error: "Dosya boyutu 5MB'dan büyük olamaz." }, { status: 400 });
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. MIME Type / Magic Bytes Verification (Spoofing Protection)
        const fileType = await fileTypeFromBuffer(buffer);
        if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime)) {
            return NextResponse.json({ success: false, error: "Sadece JPG, PNG ve WEBP formatları desteklenmektedir." }, { status: 400 });
        }

        // 3. Process image (Resize, WebP, EXIF strip) via Sharp processor
        const processed = await ImageProcessor.process(buffer);

        // 4. Generate unique filename (Hash UUID)
        const filename = `${uuidv4()}.webp`;

        // Upload to storage
        const url = await storage.upload(processed.buffer, filename, 'products');

        return NextResponse.json({
            success: true,
            url,
            width: processed.width,
            height: processed.height
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Yükleme sırasında bir hata oluştu' }, { status: 500 });
    }
}
