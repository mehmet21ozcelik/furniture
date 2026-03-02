import sharp from 'sharp';

export interface ProcessedImage {
    buffer: Buffer;
    format: 'webp' | 'avif' | 'png' | 'jpeg';
    width: number;
    height: number;
}

export class ImageProcessor {
    /**
     * Processes an image: resizes, strips metadata (EXIF), and converts to WebP.
     * @param input Input buffer or path.
     * @param options Processing options.
     */
    static async process(
        input: Buffer,
        options: {
            maxWidth?: number;
            quality?: number;
            format?: 'webp' | 'avif';
        } = {}
    ): Promise<ProcessedImage> {
        const {
            maxWidth = 1920,
            quality = 85,
            format = 'webp'
        } = options;

        let pipeline = sharp(input)
            .rotate() // Automatic rotation based on EXIF
            .resize({
                width: maxWidth,
                withoutEnlargement: true,
            })
            .toFormat(format, { quality });

        // metadata() is used to get the original dimensions
        const metadata = await sharp(input).metadata();

        const buffer = await pipeline.toBuffer();

        return {
            buffer,
            format,
            width: metadata.width || 0,
            height: metadata.height || 0,
        };
    }
}
