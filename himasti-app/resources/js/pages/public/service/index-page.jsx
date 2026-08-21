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
                                    className="group hover-lift relative overflow-hidden border border-line bg-white p-6 transition hover:border-volt focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:outline-none"
                                    data-reveal
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-volt via-aqua to-flare transition-transform duration-500 ease-out group-hover:scale-x-100"
                                    />
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-editorial text-3xl font-semibold text-ink transition duration-300 group-hover:text-volt-deep">
                                                {service.name}
                                            </p>
                                            {service.description ? (
                                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                                    {service.description}
                                                </p>
                                            ) : null}
                                        </div>
                                        <ExternalLink className="size-4 shrink-0 text-ink-muted transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-volt" />
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
