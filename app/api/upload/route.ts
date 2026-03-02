import { NextRequest, NextResponse } from 'next/server';
import { ImageProcessor } from '@/lib/image/processor';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'Dosya bulunamadı' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ success: false, error: 'Geçersiz dosya tipi' }, { status: 400 });
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image (Resize, WebP, EXIF strip)
        const processed = await ImageProcessor.process(buffer);

        // Generate unique filename
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
