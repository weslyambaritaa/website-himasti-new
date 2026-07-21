import { cn } from "@/lib/utils";

export default function FormSection({ title, description, children, className }) {
    return (
        <section className={cn("space-y-4 rounded-xl border p-5", className)}>
            <div className="space-y-1">
                <h2 className="text-lg font-medium">{title}</h2>
                {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {children}
        </section>
    );
}
