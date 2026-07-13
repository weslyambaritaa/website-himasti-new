import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePage } from "@inertiajs/react";

export default function FlashAlert() {
    const { flash } = usePage().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    const isError = !!flash.error;

    return (
        <Alert className={isError ? "border-red-200 text-red-700" : "border-emerald-200 text-emerald-700"}>
            <AlertTitle>{isError ? "Terjadi Kendala" : "Berhasil"}</AlertTitle>
            <AlertDescription>{flash.error ?? flash.success}</AlertDescription>
        </Alert>
    );
}
