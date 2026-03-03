'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadFieldProps {
    onUploadComplete: (url: string) => void;
    onRemove: (url: string) => void;
    value: string[];
    maxFiles?: number;
}

export function ImageUploadField({
    onUploadComplete,
    onRemove,
    value = [],
    maxFiles = 5
}: ImageUploadFieldProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (value.length + files.length > maxFiles) {
            setError(`En fazla ${maxFiles} adet resim ekleyebilirsiniz.`);
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            for (const file of Array.from(files)) {
                // Front-end validasyonu (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setError(`Dosya çok büyük: ${file.name}. Maksimum 5MB olmalı.`);
                    continue;
                }

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (result.success) {
                    onUploadComplete(result.url);
                } else {
                    setError(result.error || 'Yükleme başarısız oldu.');
                }
            }
        } catch (err) {
            console.error("Yükleme hatası:", err);
            setError('Bir bağlantı hatası oluştu.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border group">
                        <Image
                            src={url}
                            alt="Yüklenen Resim"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={() => onRemove(url)}
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-furniture-bronze hover:bg-furniture-cream transition-colors group disabled:opacity-50"
                    >
                        {isUploading ? (
                            <Loader2 className="animate-spin text-furniture-bronze" />
                        ) : (
                            <>
                                <Upload className="text-gray-400 group-hover:text-furniture-bronze mb-2" />
                                <span className="text-xs text-gray-500 group-hover:text-furniture-bronze font-medium">Resim Yükle</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                multiple
                className="hidden"
            />

            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}

            <p className="text-[10px] text-gray-400">
                * Max {maxFiles} resim (Max 5MB/resim). WebP formatına otomatik dönüştürülür.
            </p>
        </div>
    );
}
