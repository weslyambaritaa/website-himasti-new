import PublicLayout from "@/components/public/public-layout";
import { usePage } from "@inertiajs/react";

export default function MaintenancePage() {
    const { identity } = usePage().props;

    return (
        <PublicLayout>
            <section className="public-section bg-[#f6f6f2]">
                <div className="public-container max-w-4xl space-y-6 text-center" data-reveal>
                    <p className="public-kicker">Pemeliharaan</p>
                    <h1 className="font-editorial text-5xl leading-none font-semibold text-black md:text-7xl">
                        Situs sedang diperbarui
                    </h1>
                    <p className="mx-auto max-w-2xl text-sm leading-8 text-slate-600 md:text-base">
                        {identity?.site_title ?? "Website HIMASTI"} untuk sementara tidak dapat diakses publik karena sedang dalam proses pemeliharaan. Silakan coba kembali beberapa saat lagi.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
