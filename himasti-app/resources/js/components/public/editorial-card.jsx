import ImageFallback from "@/components/public/image-fallback";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function EditorialCard({
    href,
    image,
    alt,
    eyebrow,
    title,
    description,
    meta,
    badge,
    imageClassName = "aspect-[4/3] w-full object-cover",
    containImage = false,
}) {
    const content = (
        <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_45px_rgba(28,32,50,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#1C2032]/25 hover:shadow-[0_22px_55px_rgba(28,32,50,0.11)]" data-reveal>
            <div className="relative overflow-hidden">
                <ImageFallback
                    src={image}
                    alt={alt}
                    className="overflow-hidden bg-slate-100"
                    imgClassName={`${imageClassName} transition duration-500 group-hover:scale-[1.035] ${containImage ? "object-contain bg-white p-5" : ""}`}
                    fallbackLabel={title}
                />
                {badge ? (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#1C2032] shadow-sm">
                        <Sparkles className="size-3.5" /> {badge}
                    </span>
                ) : null}
            </div>
            <div className="flex min-h-52 flex-col p-5 md:p-6">
                {eyebrow ? <p className="public-kicker">{eyebrow}</p> : null}
                <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold leading-snug tracking-[-0.02em] text-[#1C2032] md:text-2xl">{title}</h3>
                    {href ? <ArrowUpRight className="mt-1 size-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1C2032]" /> : null}
                </div>
                {description ? <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{description}</p> : null}
                {meta ? <p className="mt-auto pt-5 text-xs font-medium text-slate-500">{meta}</p> : null}
            </div>
        </article>
    );

    if (!href) return content;

    return (
        <Link href={href} className="block h-full rounded-2xl focus-visible:ring-2 focus-visible:ring-[#1C2032] focus-visible:ring-offset-4 focus-visible:outline-none">
            {content}
        </Link>
    );
}
