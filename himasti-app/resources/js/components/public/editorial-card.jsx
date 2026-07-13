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
        <article className="group space-y-5" data-reveal>
            <ImageFallback
                src={image}
                alt={alt}
                className="overflow-hidden bg-slate-100"
                imgClassName={`${imageClassName} transition duration-500 group-hover:scale-[1.02] ${containImage ? "object-contain bg-white p-4" : ""}`}
                fallbackLabel={title}
            />
            <div className="space-y-3">
                {eyebrow ? <p className="public-kicker text-slate-500">{eyebrow}</p> : null}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-editorial text-3xl leading-tight font-semibold text-[#1c2032]">
                        {title}
                    </h3>
                    {href ? <ArrowUpRight className="mt-2 size-4 shrink-0 text-slate-400 transition group-hover:text-[#1c2032]" /> : null}
                </div>
                {meta ? <p className="text-sm text-slate-500">{meta}</p> : null}
                {description ? <p className="text-sm leading-7 text-slate-600">{description}</p> : null}
            </div>
        </article>
    );

    if (!href) {
        return content;
    }

    return (
        <Link href={href} className="block focus-visible:ring-2 focus-visible:ring-[#1c2032] focus-visible:ring-offset-4 focus-visible:outline-none">
            {content}
        </Link>
    );
}
