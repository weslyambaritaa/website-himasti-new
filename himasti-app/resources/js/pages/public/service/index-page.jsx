import EmptyPublicState from "@/components/public/empty-public-state";
import PublicLayout from "@/components/public/public-layout";
import { usePage } from "@inertiajs/react";
import { BookOpen, BriefcaseBusiness, ExternalLink, Globe2, GraduationCap, Link2 } from "lucide-react";

function ServiceIcon({ name }) {
    const iconName = (name ?? "").toLowerCase();
    const Icon = iconName.includes("globe") || iconName.includes("web")
        ? Globe2
        : iconName.includes("book") || iconName.includes("pustaka")
          ? BookOpen
          : iconName.includes("graduate") || iconName.includes("academic")
            ? GraduationCap
            : iconName.includes("briefcase") || iconName.includes("career")
              ? BriefcaseBusiness
              : Link2;

    return <Icon className="size-7" />;
}

export default function ServiceIndexPage() {
    const { services } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Akses Cepat",
                title: "Layanan",
                description: "Kumpulan tautan layanan dan sumber daya yang dikelola serta direkomendasikan HIMASTI.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container">
                    {services.length ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {services.map((service) => (
                                <a
                                    key={service.id}
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(28,32,50,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#1C2032]/30 hover:shadow-[0_22px_55px_rgba(28,32,50,0.11)]"
                                    data-reveal
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-[#1C2032] text-white">
                                            {service.logo ? (
                                                <img src={`/storage/${service.logo}`} alt={`Logo ${service.name}`} className="h-full w-full bg-white object-contain p-2.5" />
                                            ) : (
                                                <ServiceIcon name={service.icon} />
                                            )}
                                        </div>
                                        <ExternalLink className="size-5 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1C2032]" />
                                    </div>
                                    <h2 className="mt-7 text-2xl font-extrabold tracking-[-0.03em] text-[#1C2032]">{service.name}</h2>
                                    {service.description ? <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p> : null}
                                    <p className="mt-auto pt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#1C2032]">Buka Layanan</p>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState title="Belum ada layanan aktif" description="Layanan aktif akan muncul di halaman ini setelah tersedia." />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
