'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    currentImageUrl?: string | null;
}

export default function ImageUpload({ onImageUploaded, currentImageUrl }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const supabase = createClient();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Molimo izaberite sliku (jpg, png, webp)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Slika mora biti manja od 5MB');
            return;
        }

        setUploading(true);

        try {
            // Create preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('recipe-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Upload error:', error);
                alert('Greška pri učitavanju slike. Probajte ponovo.');
                setPreview(null);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('recipe-images')
                .getPublicUrl(data.path);

            onImageUploaded(publicUrl);
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('Greška pri učitavanju slike.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">
                    Slika recepta (opciono)
                </span>
                <div className="relative">
                    {preview ? (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-primary/20 group">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer px-6 py-3 bg-white text-slate-900 rounded-full font-medium hover:bg-slate-100 transition-colors">
                                    Promeni sliku
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-slate-50/50 hover:bg-slate-100/50">
                            <div className="flex flex-col items-center justify-center py-6 text-center px-4">
                                <svg className="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="mb-2 text-sm text-slate-600">
                                    <span className="font-semibold">Klikni za upload</span> ili prevuci sliku
                                </p>
                                <p className="text-xs text-slate-500">PNG, JPG, WEBP (max. 5MB)</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                <p className="text-sm font-medium text-slate-700">Učitavanje slike...</p>
                            </div>
                        </div>
                    )}
                </div>
            </label>
        </div>
    );
}
