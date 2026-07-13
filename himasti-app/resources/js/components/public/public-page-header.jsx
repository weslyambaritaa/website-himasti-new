export default function PublicPageHeader({ kicker, title, description }) {
    return (
        <header className="border-b border-slate-200 bg-[#f6f6f2]">
            <div className="public-container py-16 md:py-24" data-reveal>
                {kicker ? <p className="public-kicker">{kicker}</p> : null}
                <h1 className="mt-4 max-w-4xl font-editorial text-5xl leading-none font-semibold text-black md:text-7xl">
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
