import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { CalendarDays, Layers3, Sparkles } from "lucide-react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });

function formatRange(startDate, endDate) {
    if (!startDate) return null;
    const start = dateFormatter.format(new Date(startDate));
    const end = endDate ? dateFormatter.format(new Date(endDate)) : null;
    return end && end !== start ? `${start} - ${end}` : start;
}

export default function PublicWorkProgramDetailPage() {
    const { workProgram } = usePage().props;

    return (
        <PublicLayout pageHeader={{ kicker: workProgram.is_featured ? "Program Unggulan" : workProgram.division?.name || "Program Kerja", title: workProgram.name, description: [workProgram.year, workProgram.status].filter(Boolean).join(" · ") }}>
            <section className="public-section bg-white">
                <div className="public-container space-y-14">
                    <Link href={route("work-programs.index")} className="public-link" data-reveal>Kembali ke Program Kerja</Link>

                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(28,32,50,0.12)]" data-reveal>
                            <ImageFallback src={workProgram.cover_image ? `/storage/${workProgram.cover_image}` : null} alt={workProgram.name} className="overflow-hidden bg-[#F4F6FA]" imgClassName="aspect-[4/3] w-full object-cover" fallbackLabel={workProgram.name} />
                            {workProgram.is_featured ? <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1C2032]"><Sparkles className="size-4" /> Program Unggulan</span> : null}
                        </div>
                        <div className="space-y-7">
                            <dl className="grid gap-4 sm:grid-cols-2" data-reveal>
                                <div className="rounded-2xl bg-[#F4F6FA] p-5"><Layers3 className="size-5 text-[#1C2032]" /><dt className="mt-4 public-kicker">Divisi</dt><dd className="mt-2 text-sm font-semibold text-slate-700">{workProgram.division?.name || "-"}</dd></div>
                                <div className="rounded-2xl bg-[#F4F6FA] p-5"><CalendarDays className="size-5 text-[#1C2032]" /><dt className="mt-4 public-kicker">Periode</dt><dd className="mt-2 text-sm font-semibold text-slate-700">{formatRange(workProgram.start_date, workProgram.end_date) || workProgram.year || "-"}</dd></div>
                            </dl>
                            <article className="rounded-3xl border border-slate-200 p-7 text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base" data-reveal>{workProgram.description || "Deskripsi program kerja belum tersedia."}</article>
                        </div>
                    </div>

                    <div className="space-y-8 border-t border-slate-200 pt-12">
                        <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-[#1C2032]" data-reveal>Dokumentasi Terkait</h2>
                        {workProgram.documentations.length ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {workProgram.documentations.map((item) => <EditorialCard key={item.id} href={route("public.documentation.show", item.slug)} image={item.cover_image ? `/storage/${item.cover_image}` : item.images?.[0]?.image ? `/storage/${item.images[0].image}` : null} alt={item.title} eyebrow={item.event_date ? dateFormatter.format(new Date(item.event_date)) : "Dokumentasi"} title={item.title} description={item.location} />)}
                            </div>
                        ) : <EmptyPublicState title="Belum ada dokumentasi" description="Dokumentasi terkait program kerja ini belum tersedia." />}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
