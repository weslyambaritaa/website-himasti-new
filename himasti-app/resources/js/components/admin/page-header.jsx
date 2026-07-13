import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminPageHeader({
    title,
    description,
    action,
    className,
}) {
    return (
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description ? (
                    <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {action ? <div className="flex items-center gap-2">{action}</div> : null}
        </div>
    );
}
