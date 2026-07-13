import EditorialCard from "@/components/public/editorial-card";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function NewsDetailPage() {
    const { newsItem } = usePage().props;
    const relatedItems = newsItem.related_items ?? [];

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Berita",
                title: newsItem.title,
                description: newsItem.published_at ? dateFormatter.format(new Date(newsItem.published_at)) : "Publikasi HIMASTI",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-12">
                    <Link href={route("public.news.index")} className="public-link" data-reveal>
                        Kembali ke Berita
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <ImageFallback
                            src={newsItem.cover_image ? `/storage/${newsItem.cover_image}` : null}
                            alt={newsItem.title}
                            className="overflow-hidden bg-slate-100"
                            imgClassName="aspect-[4/5] w-full object-cover"
                            fallbackLabel={newsItem.title}
                        />
                        <article className="space-y-6" data-reveal>
                            {newsItem.excerpt ? (
                                <p className="font-editorial text-3xl leading-tight text-[#1c2032] md:text-4xl">
                                    {newsItem.excerpt}
                                </p>
                            ) : null}
                            <div className="space-y-5 text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base">
                                {newsItem.content || "Konten berita belum tersedia."}
                            </div>
                        </article>
                    </div>

                    {relatedItems.length ? (
                        <div className="space-y-8">
                            <h2 className="font-editorial text-4xl font-semibold text-black" data-reveal>
                                Berita Terkait
                            </h2>
                            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                                {relatedItems.map((item) => (
                                    <EditorialCard
                                        key={item.id}
                                        href={route("public.news.show", item.slug)}
                                        image={item.cover_image ? `/storage/${item.cover_image}` : null}
                                        alt={item.title}
                                        eyebrow={item.published_at ? dateFormatter.format(new Date(item.published_at)) : "Berita HIMASTI"}
                                        title={item.title}
                                        description={item.excerpt}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </PublicLayout>
    );
}
