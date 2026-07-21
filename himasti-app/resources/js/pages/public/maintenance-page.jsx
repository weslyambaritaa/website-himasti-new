import PublicLayout from "@/components/public/public-layout";
import { usePage } from "@inertiajs/react";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
    const { identity } = usePage().props;

    return (
        <PublicLayout title="Pemeliharaan">
            <section className="flex min-h-[78vh] items-center bg-[#F4F6FA] pt-20">
                <div className="public-container py-16 text-center" data-reveal>
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#1C2032] text-white"><Wrench className="size-7" /></div>
                    <p className="mt-7 public-kicker">Pemeliharaan Sistem</p>
                    <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#1C2032] md:text-6xl">Situs sedang diperbarui</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-600 md:text-base">{identity?.site_title ?? "Website HIMASTI"} untuk sementara tidak dapat diakses publik. Silakan coba kembali beberapa saat lagi.</p>
                </div>
            </section>
        </PublicLayout>
    );
}
