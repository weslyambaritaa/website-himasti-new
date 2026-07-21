import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { CalendarDays, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });

function formatRange(startDate, endDate) {
    if (!startDate) return "-";
    const start = dateFormatter.format(new Date(startDate));
    const end = endDate ? dateFormatter.format(new Date(endDate)) : null;
    return end && end !== start ? `${start} - ${end}` : start;
}

export default function EventDetailPage() {
    const { eventItem } = usePage().props;

    return (
        <PublicLayout pageHeader={{ kicker: eventItem.is_featured ? "Kegiatan Unggulan" : "Kegiatan", title: eventItem.title, description: eventItem.status || "Agenda HIMASTI" }}>
            <section className="public-section bg-white">
                <div className="public-container space-y-12">
                    <Link href={route("public.event.index")} className="public-link" data-reveal>Kembali ke Kegiatan</Link>

                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(28,32,50,0.12)]" data-reveal>
                            <ImageFallback src={eventItem.cover_image ? `/storage/${eventItem.cover_image}` : null} alt={eventItem.title} className="overflow-hidden bg-[#F4F6FA]" imgClassName="aspect-[4/3] w-full object-cover" fallbackLabel={eventItem.title} />
                            {eventItem.is_featured ? <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1C2032]"><Sparkles className="size-4" /> Unggulan</span> : null}
                        </div>
                        <div className="space-y-7">
                            <dl className="grid gap-4 sm:grid-cols-2" data-reveal>
                                <div className="rounded-2xl bg-[#F4F6FA] p-5"><CalendarDays className="size-5 text-[#1C2032]" /><dt className="mt-4 public-kicker">Tanggal</dt><dd className="mt-2 text-sm font-semibold text-slate-700">{formatRange(eventItem.start_date, eventItem.end_date)}</dd></div>
                                <div className="rounded-2xl bg-[#F4F6FA] p-5"><MapPin className="size-5 text-[#1C2032]" /><dt className="mt-4 public-kicker">Lokasi</dt><dd className="mt-2 text-sm font-semibold text-slate-700">{eventItem.location || "-"}</dd></div>
                            </dl>
                            <article className="rounded-3xl border border-slate-200 p-7 text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base" data-reveal>
                                {eventItem.description || "Deskripsi kegiatan belum tersedia."}
                            </article>
                            {eventItem.registration_url ? <a href={eventItem.registration_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1C2032] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#292f49]" data-reveal>Pendaftaran Kegiatan <ExternalLink className="size-4" /></a> : null}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
