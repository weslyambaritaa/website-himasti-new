export default function ImageFallback({
    src,
    alt,
    className = "",
    imgClassName = "",
    fallbackLabel = "HIMASTI",
}) {
    if (src) {
        return (
            <div className={className}>
                <img src={src} alt={alt} className={imgClassName} />
            </div>
        );
    }

    return (
        <div className={className}>
            <div className={`flex h-full w-full items-center justify-center bg-slate-100 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 ${imgClassName}`}>
                {fallbackLabel}
            </div>
        </div>
    );
}
