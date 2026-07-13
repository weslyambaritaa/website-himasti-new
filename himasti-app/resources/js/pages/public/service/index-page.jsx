import EmptyPublicState from "@/components/public/empty-public-state";
import PublicLayout from "@/components/public/public-layout";
import { usePage } from "@inertiajs/react";
import { ExternalLink } from "lucide-react";

export default function ServiceIndexPage() {
    const { services } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Rujukan",
                title: "Layanan",
                description: "Daftar layanan dan tautan institusional yang dikelola HIMASTI.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container">
                    {services.length ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {services.map((service) => (
                                <a
                                    key={service.id}
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group border border-slate-200 p-6 transition hover:border-[#1c2032] focus-visible:ring-2 focus-visible:ring-[#1c2032] focus-visible:ring-offset-2 focus-visible:outline-none"
                                    data-reveal
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-editorial text-3xl font-semibold text-[#1c2032]">
                                                {service.name}
                                            </p>
                                            {service.description ? (
                                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                                    {service.description}
                                                </p>
                                            ) : null}
                                        </div>
                                        <ExternalLink className="size-4 shrink-0 text-slate-400 transition group-hover:text-[#1c2032]" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada layanan aktif"
                            description="Layanan aktif akan muncul di halaman ini setelah tersedia."
                        />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
