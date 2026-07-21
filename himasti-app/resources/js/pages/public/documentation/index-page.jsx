import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PaginationLinks from "@/components/public/pagination-links";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

function formatDate(value) {
    return value ? dateFormatter.format(new Date(value)) : null;
}

export default function DocumentationIndexPage() {
    const { documentations } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Galeri",
                title: "Dokumentasi",
                description:
                    "Arsip visual kegiatan dan program kerja HIMASTI yang telah dilaksanakan.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    {documentations.data.length ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {documentations.data.map((item) => {
                                    const coverImage = item.cover_image
                                        ? `/storage/${item.cover_image}`
                                        : item.images?.[0]?.image
                                          ? `/storage/${item.images[0].image}`
                                          : null;
                                    const meta =
                                        [
                                            formatDate(item.event_date),
                                            item.location,
                                        ]
                                            .filter(Boolean)
                                            .join(" · ") || "Dokumentasi";

                                    return (
                                        <Link
                                            key={item.id}
                                            href={route(
                                                "public.documentation.show",
                                                item.slug,
                                            )}
                                            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(28,32,50,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#1C2032]/25 hover:shadow-[0_22px_55px_rgba(28,32,50,0.1)]"
                                            data-reveal
                                        >
                                            <ImageFallback
                                                src={coverImage}
                                                alt={item.title}
                                                className="aspect-[4/3] overflow-hidden bg-[#F4F6FA] p-3"
                                                imgClassName="h-full w-full object-contain transition duration-500 group-hover:scale-[1.025]"
                                                fallbackLabel={item.title}
                                            />
                                            <div className="flex min-h-56 flex-col p-5 md:p-6">
                                                <p className="public-kicker">
                                                    {meta}
                                                </p>
                                                <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.025em] text-[#1C2032] md:text-2xl">
                                                    {item.title}
                                                </h2>
                                                {item.description ? (
                                                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                                                        {item.description}
                                                    </p>
                                                ) : null}
                                                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#1C2032]">
                                                    Lihat dokumentasi{" "}
                                                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                                                </span>
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
