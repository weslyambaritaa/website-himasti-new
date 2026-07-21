import { cn } from "@/lib/utils";

export default function SectionHeading({ kicker, title, description, align = "left", className, titleClassName }) {
    return (
        <div
            className={cn(
                "space-y-4",
                align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
                className
            )}
            data-reveal
        >
            {kicker ? <p className="public-kicker">{kicker}</p> : null}
            <h2 className={cn("text-3xl font-extrabold leading-tight tracking-[-0.035em] text-[#1C2032] md:text-5xl", titleClassName)}>
                {title}
            </h2>
            {description ? <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{description}</p> : null}
        </div>
    );
}
