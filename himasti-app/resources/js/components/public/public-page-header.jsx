export default function PublicPageHeader({ kicker, title, description }) {
    return (
        <header className="relative overflow-hidden bg-[#1C2032] pt-20 text-white">
            <div className="absolute inset-0 opacity-40 public-grid-pattern" aria-hidden="true" />
            <div className="public-container relative py-16 md:py-24" data-reveal>
                {kicker ? <p className="public-kicker text-white/60">{kicker}</p> : null}
                <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
                    {title}
                </h1>
                {description ? (
                    <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                        {description}
                    </p>
                ) : null}
            </div>
        </header>
    );
}
