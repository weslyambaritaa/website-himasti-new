import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

function formatRange(startDate, endDate) {
    if (!startDate) {
        return null;
    }

    const start = dateFormatter.format(new Date(startDate));
    const end = endDate ? dateFormatter.format(new Date(endDate)) : null;

    return end && end !== start ? `${start} - ${end}` : start;
}

export default function PublicWorkProgramDetailPage() {
    const { workProgram } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: workProgram.division?.name || "Program Kerja",
                title: workProgram.name,
                description: [workProgram.year, workProgram.status].filter(Boolean).join(" · "),
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-12">
                    <Link href={route("work-programs.index")} className="public-link" data-reveal>
                        Kembali ke Program Kerja
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <ImageFallback
                            src={workProgram.cover_image ? `/storage/${workProgram.cover_image}` : null}
                            alt={workProgram.name}
                            className="overflow-hidden bg-slate-100"
                            imgClassName="aspect-[4/5] w-full object-cover"
                            fallbackLabel={workProgram.name}
                        />
                        <div className="space-y-8">
                            <dl className="grid gap-4 border-t border-slate-200 pt-5" data-reveal>
                                <div>
                                    <dt className="public-kicker">Divisi</dt>
                                    <dd className="mt-1 text-sm text-slate-700 md:text-base">{workProgram.division?.name || "-"}</dd>
                                </div>
                                <div>
                                    <dt className="public-kicker">Periode</dt>
                                    <dd className="mt-1 text-sm text-slate-700 md:text-base">{formatRange(workProgram.start_date, workProgram.end_date) || "-"}</dd>
                                </div>
                            </dl>
                            <article className="text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base" data-reveal>
                                {workProgram.description || "Deskripsi program kerja belum tersedia."}
                            </article>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="font-editorial text-4xl font-semibold text-black" data-reveal>
                            Dokumentasi Terkait
                        </h2>
                        {workProgram.documentations.length ? (
                            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                                {workProgram.documentations.map((item) => (
                                    <EditorialCard
                                        key={item.id}
                                        href={route("public.documentation.show", item.slug)}
                                        image={item.cover_image ? `/storage/${item.cover_image}` : item.images?.[0]?.image ? `/storage/${item.images[0].image}` : null}
                                        alt={item.title}
                                        eyebrow={item.event_date ? dateFormatter.format(new Date(item.event_date)) : "Dokumentasi"}
                                        title={item.title}
                                        description={item.location}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyPublicState
                                title="Belum ada dokumentasi"
                                description="Dokumentasi terkait program kerja ini belum tersedia."
                            />
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
