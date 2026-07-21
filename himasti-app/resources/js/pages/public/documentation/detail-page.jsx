import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { CalendarDays, MapPin, Maximize2 } from "lucide-react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function DocumentationDetailPage() {
    const { documentation } = usePage().props;
    const description = [
        documentation.event_date
            ? dateFormatter.format(new Date(documentation.event_date))
            : null,
        documentation.location,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Dokumentasi",
                title: documentation.title,
                description,
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-12">
                    <Link
                        href={route("public.documentation.index")}
                        className="public-link"
                        data-reveal
                    >
                        Kembali ke Dokumentasi
                    </Link>

                    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
                        <aside
                            className="space-y-5 rounded-3xl bg-[#F4F6FA] p-7"
                            data-reveal
                        >
                            {documentation.event_date ? (
                                <div className="flex gap-3">
                                    <CalendarDays className="mt-0.5 size-5 shrink-0 text-[#1C2032]" />
                                    <div>
                                        <p className="public-kicker">Tanggal</p>
                                        <p className="mt-2 text-sm text-slate-700">
                                            {dateFormatter.format(
                                                new Date(
                                                    documentation.event_date,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                            {documentation.location ? (
                                <div className="flex gap-3">
                                    <MapPin className="mt-0.5 size-5 shrink-0 text-[#1C2032]" />
                                    <div>
                                        <p className="public-kicker">Lokasi</p>
                                        <p className="mt-2 text-sm text-slate-700">
                                            {documentation.location}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                            {documentation.work_program?.name ? (
                                <div className="border-t border-slate-200 pt-5">
                                    <p className="public-kicker">
                                        Program Kerja
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-[#1C2032]">
                                        {documentation.work_program.name}
                                    </p>
                                </div>
                            ) : null}
                        </aside>
                        <article
                            className="rounded-3xl border border-slate-200 p-7 text-sm leading-8 whitespace-pre-line text-slate-700 md:p-10 md:text-base"
                            data-reveal
                        >
                            {documentation.description ||
                                "Deskripsi dokumentasi belum tersedia."}
                        </article>
                    </div>

                    {documentation.images.length ? (
                        <div className="space-y-7">
                            <div data-reveal>
                                <p className="public-kicker">Koleksi Foto</p>
                                <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#1C2032] md:text-3xl">
                                    Galeri Dokumentasi
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                    Klik gambar untuk melihat ukuran penuh tanpa
                                    pemotongan.
                                </p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {documentation.images.map((image) => {
                                    const imageUrl = image.image
                                        ? `/storage/${image.image}`
                                        : null;

                                    return (
                                        <figure
                                            key={image.id}
                                            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(28,32,50,0.05)]"
                                            data-reveal
                                        >
                                            {imageUrl ? (
                                                <a
                                                    href={imageUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative block aspect-[4/3] overflow-hidden bg-[#F4F6FA] p-3 focus-visible:ring-2 focus-visible:ring-[#1C2032] focus-visible:outline-none"
                                                >
                                                    <ImageFallback
                                                        src={imageUrl}
                                                        alt={
                                                            image.caption ||
                                                            documentation.title
                                                        }
                                                        className="h-full w-full"
                                                        imgClassName="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                                                        fallbackLabel={
                                                            documentation.title
                                                        }
                                                    />
                                                    <span className="absolute right-5 top-5 inline-flex size-10 items-center justify-center rounded-full bg-[#1C2032]/85 text-white opacity-0 shadow-lg backdrop-blur-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
                                                        <Maximize2 className="size-4" />
                                                    </span>
                                                </a>
                                            ) : (
                                                <ImageFallback
                                                    src={null}
                                                    alt={
                                                        image.caption ||
                                                        documentation.title
                                                    }
                                                    className="aspect-[4/3] bg-[#F4F6FA] p-3"
                                                    imgClassName="h-full w-full object-contain"
                                                    fallbackLabel={
                                                        documentation.title
                                                    }
                                                />
                                            )}
                                            {image.caption ? (
                                                <figcaption className="border-t border-slate-100 p-5 text-sm leading-6 text-slate-600">
                                                    {image.caption}
                                                </figcaption>
                                            ) : null}
                                        </figure>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada foto"
                            description="Foto dokumentasi belum tersedia."
                        />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
