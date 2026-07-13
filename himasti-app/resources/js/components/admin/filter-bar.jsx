import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminFilterBar({ children, onReset, className, resetLabel = "Reset filter" }) {
    return (
        <div className={cn("rounded-xl border bg-card p-4", className)}>
            <div className="grid gap-3">{children}</div>
            {onReset ? (
                <div className="mt-4 flex justify-start">
                    <Button type="button" variant="ghost" onClick={onReset}>
                        {resetLabel}
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
