import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function DeleteConfirmationDialog({
    title,
    description,
    itemName,
    onConfirm,
    triggerLabel = "Hapus",
    confirmLabel = "Hapus",
    processingLabel = "Menghapus...",
}) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleConfirm = async () => {
        try {
            setProcessing(true);
            await onConfirm?.();
            setOpen(false);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-red-500 text-red-600 hover:text-red-700">
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="space-y-2">
                        <span className="block font-medium text-foreground">{itemName}</span>
                        <span className="block">{description}</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={processing}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={processing}>
                        {processing ? processingLabel : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
