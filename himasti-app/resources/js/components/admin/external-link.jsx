import { cn } from "@/lib/utils";

export default function ExternalLink({ href, children, className, fallback = "-" }) {
    if (!href) {
        return <span className="text-sm text-muted-foreground">{fallback}</span>;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("break-all text-sm text-primary underline-offset-4 hover:underline", className)}
        >
            {children ?? href}
        </a>
    );
}
