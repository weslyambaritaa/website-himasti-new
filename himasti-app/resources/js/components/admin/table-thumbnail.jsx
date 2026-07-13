import MediaPreview from "@/components/media-preview";

export default function TableThumbnail({ path, alt, emptyLabel = "Tanpa gambar", className = "h-16 rounded-md object-cover" }) {
    return (
        <div className="w-24">
            <MediaPreview
                fallbackPath={path}
                alt={alt}
                emptyLabel={emptyLabel}
                className={className}
            />
        </div>
    );
}
