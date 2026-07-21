import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function FormActions({
    cancelHref,
    processing = false,
    submitLabel = "Simpan",
    processingLabel = "Menyimpan...",
}) {
    return (
        <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={processing}>
                {processing ? processingLabel : submitLabel}
            </Button>
            {cancelHref ? (
                <Button variant="outline" asChild>
                    <Link href={cancelHref}>Batal</Link>
                </Button>
            ) : null}
        </div>
    );
}
