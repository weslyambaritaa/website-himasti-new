import { Link } from "@inertiajs/react";

export default function PaginationLinks({ links = [] }) {
    const visibleLinks = links.filter((item) => item.label !== "&laquo; Previous" && item.label !== "Next &raquo;");
    if (visibleLinks.length <= 1) return null;

    return (
        <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center justify-center gap-2 pt-8" data-reveal>
            {links.map((item, index) => item.url ? (
                <Link
                    key={`${item.label}-${index}`}
                    href={item.url}
                    preserveScroll
                    className={`inline-flex min-w-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${item.active ? "border-[#1C2032] bg-[#1C2032] text-white" : "border-slate-300 bg-white text-slate-600 hover:border-[#1C2032] hover:text-[#1C2032]"}`}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                />
            ) : (
                <span key={`${item.label}-${index}`} className="inline-flex min-w-10 items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: item.label }} />
            ))}
        </nav>
    );
}
