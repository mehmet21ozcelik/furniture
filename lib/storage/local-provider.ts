import fs from 'fs/promises';
import path from 'path';
import { IStorageProvider } from './types';

export class LocalProvider implements IStorageProvider {
    private publicDir: string;
    private uploadDir: string;

    constructor(publicDir: string = 'public', uploadDir: string = 'uploads') {
        this.publicDir = path.join(process.cwd(), publicDir);
        this.uploadDir = uploadDir;
    }

    async upload(file: Buffer, filename: string, folder: string = ''): Promise<string> {
        const relativeDir = path.join(this.uploadDir, folder);
        const absoluteDir = path.join(this.publicDir, relativeDir);

        // Ensure directory exists
        await fs.mkdir(absoluteDir, { recursive: true });

        const absolutePath = path.join(absoluteDir, filename);
        const relativePath = path.join('/', relativeDir, filename).replace(/\\/g, '/');

        await fs.writeFile(absolutePath, file);

        return relativePath;
    }

    async delete(filePath: string): Promise<void> {
        // filePath is expected to be a relative path like '/uploads/filename.webp'
        const absolutePath = path.join(this.publicDir, filePath.startsWith('/') ? filePath.slice(1) : filePath);

        try {
            await fs.unlink(absolutePath);
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
            // If file doesn't exist, we consider it deleted
        }
    }
}
