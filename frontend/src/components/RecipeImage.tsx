
'use client';

import { useState } from 'react';
import Image from 'next/image';
import RecipePlaceholder from './RecipePlaceholder';

interface RecipeImageProps {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    children?: React.ReactNode;
}

export default function RecipeImage({ src, alt, className, fill, sizes, priority, children }: RecipeImageProps) {
    const [error, setError] = useState(false);

    if (error) {
        return <RecipePlaceholder />;
    }

    return (
        <>
            <Image
                src={src}
                alt={alt}
                fill={fill}
                className={className}
                sizes={sizes}
                priority={priority}
                onError={() => setError(true)}
            />
            {children}
        </>
    );
}
