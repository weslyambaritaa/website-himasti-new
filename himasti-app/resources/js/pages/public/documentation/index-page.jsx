import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PaginationLinks from "@/components/public/pagination-links";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function DocumentationIndexPage() {
    const { documentations } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Galeri",
                title: "Dokumentasi",
                description: "Arsip dokumentasi kegiatan dan program kerja HIMASTI.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    {documentations.data.length ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {documentations.data.map((item, index) => {
                                    const coverImage = item.cover_image
                                        ? `/storage/${item.cover_image}`
                                        : item.images?.[0]?.image
                                          ? `/storage/${item.images[0].image}`
                                          : null;

                                    return (
                                        <Link
                                            key={item.id}
                                            href={route("public.documentation.show", item.slug)}
                                            className={`group block focus-visible:ring-2 focus-visible:ring-[#1c2032] focus-visible:ring-offset-2 focus-visible:outline-none ${index === 0 ? "md:col-span-2" : ""}`}
                                            data-reveal
                                        >
                                            <ImageFallback
                                                src={coverImage}
                                                alt={item.title}
                                                className="overflow-hidden bg-slate-100"
                                                imgClassName={`w-full object-cover transition duration-500 group-hover:scale-[1.02] ${index === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}`}
                                                fallbackLabel={item.title}
                                            />
                                            <div className="space-y-2 px-1 pt-4">
                                                <p className="public-kicker">
                                                    {[item.event_date ? dateFormatter.format(new Date(item.event_date)) : null, item.location].filter(Boolean).join(" · ")}
                                                </p>
                                                <h2 className="font-editorial text-3xl leading-tight font-semibold text-[#1c2032]">
                                                    {item.title}
                                                </h2>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            <PaginationLinks links={documentations.links} />
                        </>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada dokumentasi"
                            description="Dokumentasi terbaru akan muncul di halaman ini setelah tersedia."
                        />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
