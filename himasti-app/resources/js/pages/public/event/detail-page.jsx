import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { ExternalLink } from "lucide-react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

function formatRange(startDate, endDate) {
    if (!startDate) {
        return "-";
    }

    const start = dateFormatter.format(new Date(startDate));
    const end = endDate ? dateFormatter.format(new Date(endDate)) : null;

    return end && end !== start ? `${start} - ${end}` : start;
}

export default function EventDetailPage() {
    const { eventItem } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Kegiatan",
                title: eventItem.title,
                description: eventItem.status || "Agenda HIMASTI",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-12">
                    <Link href={route("public.event.index")} className="public-link" data-reveal>
                        Kembali ke Kegiatan
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <ImageFallback
                            src={eventItem.cover_image ? `/storage/${eventItem.cover_image}` : null}
                            alt={eventItem.title}
                            className="overflow-hidden bg-slate-100"
                            imgClassName="aspect-[4/5] w-full object-cover"
                            fallbackLabel={eventItem.title}
                        />
                        <div className="space-y-8">
                            <dl className="grid gap-5 border-t border-slate-200 pt-5" data-reveal>
                                <div className="grid gap-1">
                                    <dt className="public-kicker">Tanggal</dt>
                                    <dd className="text-sm text-slate-700 md:text-base">{formatRange(eventItem.start_date, eventItem.end_date)}</dd>
                                </div>
                                <div className="grid gap-1">
                                    <dt className="public-kicker">Lokasi</dt>
                                    <dd className="text-sm text-slate-700 md:text-base">{eventItem.location || "-"}</dd>
                                </div>
                                <div className="grid gap-1">
                                    <dt className="public-kicker">Status</dt>
                                    <dd className="text-sm text-slate-700 md:text-base">{eventItem.status || "-"}</dd>
                                </div>
                            </dl>

                            <article className="space-y-5 text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base" data-reveal>
                                {eventItem.description || "Deskripsi kegiatan belum tersedia."}
                            </article>

                            {eventItem.registration_url ? (
                                <a
                                    href={eventItem.registration_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="public-link"
                                    data-reveal
                                >
                                    Pendaftaran Kegiatan
                                    <ExternalLink className="size-4" />
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
