import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PREVIOUS_LABELS = ["pagination.previous", "&laquo; previous", "« previous", "previous", "sebelumnya"];
const NEXT_LABELS = ["pagination.next", "next &raquo;", "next »", "next", "berikutnya"];

function resolveLabel(rawLabel) {
    const normalized = String(rawLabel ?? "").trim().toLowerCase();

    if (PREVIOUS_LABELS.includes(normalized)) {
        return { kind: "previous", text: "Sebelumnya" };
    }

    if (NEXT_LABELS.includes(normalized)) {
        return { kind: "next", text: "Berikutnya" };
    }

    return { kind: "page", text: String(rawLabel ?? "").replace(/&hellip;|&#8230;/g, "…") };
}

export default function PaginationLinks({ links = [] }) {
    const items = links.map((item) => ({ ...item, ...resolveLabel(item.label) }));

    if (items.filter((item) => item.kind === "page").length <= 1) {
        return null;
    }

    return (
        <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center gap-2 pt-8" data-reveal>
            {items.map((item, index) => {
                const isArrow = item.kind !== "page";
                const baseClass = "inline-flex min-w-10 items-center justify-center gap-1.5 border px-4 py-2 text-sm font-semibold transition duration-300";
                const content = (
                    <>
                        {item.kind === "previous" ? <ChevronLeft className="size-4" aria-hidden="true" /> : null}
                        <span className={isArrow ? "hidden sm:inline" : undefined}>{item.text}</span>
                        {item.kind === "next" ? <ChevronRight className="size-4" aria-hidden="true" /> : null}
                    </>
                );

                if (!item.url) {
                    return (
                        <span
                            key={`${item.label}-${index}`}
                            aria-disabled="true"
                            className={`${baseClass} border-line text-ink-muted/50`}
                        >
                            {content}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${item.label}-${index}`}
                        href={item.url}
                        aria-current={item.active ? "page" : undefined}
                        className={`${baseClass} ${
                            item.active
                                ? "btn-volt border-transparent"
                                : "border-line text-ink-muted hover:-translate-y-0.5 hover:border-volt hover:text-volt-deep"
                        }`}
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}
