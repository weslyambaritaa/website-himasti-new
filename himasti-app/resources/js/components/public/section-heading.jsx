import { cn } from "@/lib/utils";

export default function SectionHeading({
    kicker,
    title,
    description,
    align = "left",
    className,
    titleClassName,
}) {
    return (
        <div
            className={cn(
                "space-y-4",
                align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
                className
            )}
            data-reveal
        >
            {kicker ? (
                <div className={cn("flex flex-col gap-3", align === "center" ? "items-center" : "items-start")}>
                    <span className="accent-rule" aria-hidden="true" />
                    <p className="public-kicker">{kicker}</p>
                </div>
            ) : null}
            <h2 className={cn("font-editorial text-4xl leading-none font-semibold text-ink md:text-6xl", titleClassName)}>
                {title}
            </h2>
            {description ? (
                <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
