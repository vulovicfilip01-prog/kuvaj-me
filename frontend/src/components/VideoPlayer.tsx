'use client';

import React from 'react';

interface VideoPlayerProps {
    url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
    if (!url) return null;

    const getEmbedUrl = (url: string) => {
        // YouTube
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch && youtubeMatch[1]) {
            return {
                type: 'youtube',
                src: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
            };
        }

        // TikTok
        const tiktokRegex = /tiktok\.com\/.*\/video\/(\d+)/;
        const tiktokMatch = url.match(tiktokRegex);
        if (tiktokMatch && tiktokMatch[1]) {
            return {
                type: 'tiktok',
                src: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
            };
        }

        // Vimeo
        const vimeoRegex = /vimeo\.com\/(\d+)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch && vimeoMatch[1]) {
            return {
                type: 'vimeo',
                src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
            };
        }

        return null;
    };

    const embedData = getEmbedUrl(url);

    if (!embedData) {
        return (
            <div className="p-4 bg-slate-100 rounded-xl text-slate-500 text-center text-sm">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Pogledaj video na izvornoj stranici ↗
                </a>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black aspect-video hover:shadow-2xl transition-all duration-300">
            <iframe
                src={embedData.src}
                title="Video recept"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
            ></iframe>
        </div>
    );
};

export default VideoPlayer;
