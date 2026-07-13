import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function PaginationLinks({ paginator }) {
    if (!paginator?.links || paginator.links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {paginator.links.map((link, index) => (
                <Button
                    key={`${link.label}-${index}`}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link href={link.url} preserveScroll>
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    )}
                </Button>
            ))}
        </div>
    );
}
