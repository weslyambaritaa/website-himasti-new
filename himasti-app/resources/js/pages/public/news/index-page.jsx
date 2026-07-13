import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import PaginationLinks from "@/components/public/pagination-links";
import PublicLayout from "@/components/public/public-layout";
import SectionHeading from "@/components/public/section-heading";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function NewsIndexPage() {
    const { newsItems } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Publikasi",
                title: "Berita",
                description: "Kumpulan berita resmi HIMASTI yang telah dipublikasikan.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <SectionHeading
                        kicker="Arsip Berita"
                        title="Catatan, Gagasan, dan Kegiatan"
                        description="Seluruh berita ditampilkan secara kronologis berdasarkan waktu publikasi terbaru."
                    />
                    {newsItems.data.length ? (
                        <>
                            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                                {newsItems.data.map((item) => (
                                    <EditorialCard
                                        key={item.id}
                                        href={route("public.news.show", item.slug)}
                                        image={item.cover_image ? `/storage/${item.cover_image}` : null}
                                        alt={item.title}
                                        eyebrow={item.published_at ? dateFormatter.format(new Date(item.published_at)) : "Berita HIMASTI"}
                                        title={item.title}
                                        description={item.excerpt}
                                        imageClassName="aspect-[4/3] w-full object-cover"
                                    />
                                ))}
                            </div>
                            <PaginationLinks links={newsItems.links} />
                        </>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada berita"
                            description="Berita yang telah diterbitkan akan muncul di halaman ini."
                        />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
