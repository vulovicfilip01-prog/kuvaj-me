'use client';

export default function PrintStyles() {
    return (
        <style jsx global>{`
            @media print {
                .no-print { display: none !important; }
                .print-title { page-break-after: avoid; }
                .print-section { page-break-inside: avoid; }
                body { background: white !important; }
                * { color: black !important; background: white !important; }
            }
        `}</style>
    );
}
