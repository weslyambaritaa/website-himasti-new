import EditorialCard from "@/components/public/editorial-card";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { CalendarDays } from "lucide-react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function NewsDetailPage() {
    const { newsItem } = usePage().props;
    const relatedItems = newsItem.related_items ?? [];
    const publishedDate = newsItem.published_at ? dateFormatter.format(new Date(newsItem.published_at)) : "Publikasi HIMASTI";

    return (
        <PublicLayout pageHeader={{ kicker: "Berita", title: newsItem.title, description: publishedDate }} description={newsItem.excerpt}>
            <section className="public-section bg-white">
                <div className="public-container space-y-14">
                    <Link href={route("public.news.index")} className="public-link" data-reveal>Kembali ke Berita</Link>

                    <ImageFallback src={newsItem.cover_image ? `/storage/${newsItem.cover_image}` : null} alt={newsItem.title} className="overflow-hidden rounded-3xl bg-[#F4F6FA] shadow-[0_22px_65px_rgba(28,32,50,0.10)]" imgClassName="aspect-[16/8] w-full object-cover" fallbackLabel={newsItem.title} />

                    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.28fr_0.72fr]">
                        <aside data-reveal>
                            <div className="sticky top-28 rounded-2xl bg-[#F4F6FA] p-5">
                                <CalendarDays className="size-5 text-[#1C2032]" />
                                <p className="mt-4 public-kicker">Diterbitkan</p>
                                <p className="mt-2 text-sm font-semibold text-slate-700">{publishedDate}</p>
                            </div>
                        </aside>
                        <article data-reveal>
                            {newsItem.excerpt ? <p className="mb-8 text-xl font-bold leading-relaxed tracking-[-0.02em] text-[#1C2032] md:text-2xl">{newsItem.excerpt}</p> : null}
                            <div className="space-y-5 text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base">{newsItem.content || "Konten berita belum tersedia."}</div>
                        </article>
                    </div>

                    {relatedItems.length ? (
                        <div className="border-t border-slate-200 pt-12">
                            <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-[#1C2032]" data-reveal>Berita Terkait</h2>
                            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {relatedItems.map((item) => <EditorialCard key={item.id} href={route("public.news.show", item.slug)} image={item.cover_image ? `/storage/${item.cover_image}` : null} alt={item.title} eyebrow={item.published_at ? dateFormatter.format(new Date(item.published_at)) : "Berita HIMASTI"} title={item.title} description={item.excerpt} />)}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </PublicLayout>
    );
}
