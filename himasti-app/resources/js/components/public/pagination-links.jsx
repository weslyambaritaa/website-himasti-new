import { Link } from "@inertiajs/react";

export default function PaginationLinks({ links = [] }) {
    const visibleLinks = links.filter((item) => item.label !== "&laquo; Previous" && item.label !== "Next &raquo;");

    if (visibleLinks.length <= 1) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 pt-8" data-reveal>
            {links.map((item, index) => (
                item.url ? (
                    <Link
                        key={`${item.label}-${index}`}
                        href={item.url}
                        className={`inline-flex min-w-10 items-center justify-center border px-4 py-2 text-sm transition ${
                            item.active
                                ? "border-[#1c2032] bg-[#1c2032] text-white"
                                : "border-slate-300 text-slate-600 hover:border-[#1c2032] hover:text-[#1c2032]"
                        }`}
                        dangerouslySetInnerHTML={{ __html: item.label }}
                    />
                ) : (
                    <span
                        key={`${item.label}-${index}`}
                        className="inline-flex min-w-10 items-center justify-center border border-slate-200 px-4 py-2 text-sm text-slate-300"
                        dangerouslySetInnerHTML={{ __html: item.label }}
                    />
                )
            ))}
        </div>
    );
}
