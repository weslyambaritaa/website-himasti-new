import ImageFallback from "@/components/public/image-fallback";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";

export default function EditorialCard({
    href,
    image,
    alt,
    eyebrow,
    title,
    description,
    meta,
    imageClassName = "aspect-[4/3] w-full object-cover",
    containImage = false,
}) {
    const content = (
        <article className="group hover-lift space-y-5" data-reveal>
            <div className="relative overflow-hidden">
                <ImageFallback
                    src={image}
                    alt={alt}
                    className="overflow-hidden bg-mist-deep"
                    imgClassName={`${imageClassName} transition duration-700 ease-out group-hover:scale-105 ${containImage ? "object-contain bg-white p-4" : ""}`}
                    fallbackLabel={title}
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-linear-to-r from-volt via-aqua to-flare transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
            </div>
            <div className="space-y-3">
                {eyebrow ? <p className="public-kicker">{eyebrow}</p> : null}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-editorial text-3xl leading-tight font-semibold text-ink transition duration-300 group-hover:text-volt-deep">
                        {title}
                    </h3>
                    {href ? <ArrowUpRight className="mt-2 size-4 shrink-0 text-ink-muted transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-volt" /> : null}
                </div>
                {meta ? <p className="text-sm text-ink-muted">{meta}</p> : null}
                {description ? <p className="text-sm leading-7 text-slate-600">{description}</p> : null}
            </div>
        </article>
    );

    if (!href) {
        return content;
    }

    return (
        <Link href={href} className="block focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-4 focus-visible:outline-none">
            {content}
        </Link>
    );
}
