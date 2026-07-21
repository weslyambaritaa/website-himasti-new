import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import PaginationLinks from "@/components/public/pagination-links";
import PublicLayout from "@/components/public/public-layout";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function EventIndexPage() {
    const { events } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Agenda",
                title: "Kegiatan",
                description: "Daftar kegiatan HIMASTI yang sedang berlangsung, akan datang, dan terbaru.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    {events.data.length ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {events.data.map((item) => (
                                    <EditorialCard
                                        key={item.id}
                                        href={route("public.event.show", item.slug)}
                                        image={item.cover_image ? `/storage/${item.cover_image}` : null}
                                        alt={item.title}
                                        eyebrow={[item.status, item.start_date ? dateFormatter.format(new Date(item.start_date)) : null].filter(Boolean).join(" · ")}
                                        title={item.title}
                                        description={item.location || "Lokasi akan diinformasikan lebih lanjut."}
                                        badge={item.is_featured ? "Kegiatan Unggulan" : null}
                                        imageClassName="aspect-[4/5] w-full object-cover"
                                    />
                                ))}
                            </div>
                            <PaginationLinks links={events.links} />
                        </>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada kegiatan terbit"
                            description="Kegiatan yang dipublikasikan dari panel admin akan muncul di sini."
                        />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
