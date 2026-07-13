import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function DocumentationDetailPage() {
    const { documentation } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Dokumentasi",
                title: documentation.title,
                description: [documentation.event_date ? dateFormatter.format(new Date(documentation.event_date)) : null, documentation.location].filter(Boolean).join(" · "),
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-12">
                    <Link href={route("public.documentation.index")} className="public-link" data-reveal>
                        Kembali ke Dokumentasi
                    </Link>

                    <article className="max-w-4xl text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base" data-reveal>
                        {documentation.description || "Deskripsi dokumentasi belum tersedia."}
                    </article>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {documentation.images.map((image) => (
                            <figure key={image.id} className="space-y-3" data-reveal>
                                <ImageFallback
                                    src={image.image ? `/storage/${image.image}` : null}
                                    alt={image.caption || documentation.title}
                                    className="overflow-hidden bg-slate-100"
                                    imgClassName="aspect-[4/5] w-full object-cover"
                                    fallbackLabel={documentation.title}
                                />
                                {image.caption ? (
                                    <figcaption className="text-sm leading-6 text-slate-600">
                                        {image.caption}
                                    </figcaption>
                                ) : null}
                            </figure>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
