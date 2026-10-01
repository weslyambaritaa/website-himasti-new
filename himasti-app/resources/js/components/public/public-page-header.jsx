export default function PublicPageHeader({ kicker, title, description }) {
    return (
        <header className="relative overflow-hidden border-b border-line bg-mist">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -right-24 size-[26rem] rounded-full bg-volt/12 blur-3xl"
            />
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-volt via-aqua to-flare" />
            <div className="public-container relative py-16 md:py-24" data-reveal>
                {kicker ? <p className="public-kicker">{kicker}</p> : null}
                <h1 className="mt-4 max-w-4xl font-editorial text-5xl leading-none font-semibold text-ink md:text-7xl">
                    {title}
                </h1>
                {description ? (
                    <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                        {description}
                    </p>
                ) : null}
            </div>
        </header>
    );
}
