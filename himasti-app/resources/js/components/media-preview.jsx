import { useEffect, useState } from "react";

function resolveSource(file, fallbackPath) {
    if (file instanceof File) {
        return URL.createObjectURL(file);
    }

    if (fallbackPath) {
        return `/storage/${fallbackPath}`;
    }

    return null;
}

export default function MediaPreview({
    file,
    fallbackPath = null,
    alt = "Preview gambar",
    className = "",
    emptyLabel = "Belum ada gambar",
}) {
    const [src, setSrc] = useState(() => resolveSource(file, fallbackPath));

    useEffect(() => {
        const nextSrc = resolveSource(file, fallbackPath);
        setSrc(nextSrc);

        return () => {
            if (nextSrc && file instanceof File) {
                URL.revokeObjectURL(nextSrc);
            }
        };
    }, [file, fallbackPath]);

    if (!src) {
        return (
            <div className={`flex h-40 items-center justify-center rounded-lg border border-dashed bg-muted/40 text-sm text-muted-foreground ${className}`}>
                {emptyLabel}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`h-40 w-full rounded-lg border object-cover ${className}`}
        />
    );
}
