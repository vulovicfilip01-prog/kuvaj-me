import Image from 'next/image';

const images = [
    {
        src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80",
        alt: "Tradicionalno jelo",
        className: "rounded-2xl shadow-xl rotate-[-6deg] hover:rotate-0 transition-all duration-300 z-10"
    },
    {
        src: "https://images.unsplash.com/photo-1589227365533-cee630bd59bd?auto=format&fit=crop&q=80",
        alt: "Domaće pecivo",
        className: "rounded-2xl shadow-xl rotate-[6deg] hover:rotate-0 transition-all duration-300 translate-y-8"
    },
    {
        src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80",
        alt: "Zdrava salata",
        className: "rounded-2xl shadow-xl rotate-[-3deg] hover:rotate-0 transition-all duration-300 -translate-y-4"
    },
    {
        src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80",
        alt: "Slatkiš",
        className: "rounded-2xl shadow-xl rotate-[3deg] hover:rotate-0 transition-all duration-300 translate-y-4"
    }
];

export default function HeroImages() {
    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {images.map((img, idx) => (
                <div key={idx} className={`relative aspect-square w-full ${img.className}`}>
                    <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        priority={idx < 2}
                    />
                </div>
            ))}
        </div>
    );
}
