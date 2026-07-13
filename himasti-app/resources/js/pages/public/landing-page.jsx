import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import SectionHeading from "@/components/public/section-heading";
import { Link, usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

function formatDate(value) {
    return value ? dateFormatter.format(new Date(value)) : null;
}

function formatMissionItems(mission) {
    if (!mission) {
        return [];
    }

    return mission
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function LandingPage() {
    const {
        organizationProfile,
        siteSettings,
        banners,
        latestNews,
        latestEvents,
        activeDivisions,
        latestWorkPrograms,
        latestDocumentations,
        instagramPosts,
        activeServices,
    } = usePage().props;

    const heroSlides = banners.length ? banners : [{ id: "fallback", image: null }];
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

        updateMotionPreference();
        mediaQuery.addEventListener("change", updateMotionPreference);

        return () => mediaQuery.removeEventListener("change", updateMotionPreference);
    }, []);

    useEffect(() => {
        if (heroSlides.length <= 1 || isPaused || prefersReducedMotion) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 6000);

        return () => window.clearInterval(timer);
    }, [heroSlides.length, isPaused, prefersReducedMotion]);

    const profileName = organizationProfile?.organization_name || "Himpunan Mahasiswa Informatika";
    const tagline = organizationProfile?.tagline || "Institut Teknologi Del";
    const cabinetLine = [organizationProfile?.cabinet_name, organizationProfile?.period]
        .filter(Boolean)
        .join(" · ");
    const missionItems = formatMissionItems(organizationProfile?.mission);
    const leadNews = latestNews[0] ?? null;
    const secondaryNews = latestNews.slice(1);
    const visibleInstagramPosts = instagramPosts ?? [];

    return (
        <PublicLayout overlayNavbar mainClassName="overflow-x-hidden">
            <section
                className="relative min-h-screen overflow-hidden bg-ink text-white"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocusCapture={() => setIsPaused(true)}
                onBlurCapture={() => setIsPaused(false)}
            >
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
                        aria-hidden={index !== activeSlide}
                    >
                        <ImageFallback
                            src={slide.image ? `/storage/${slide.image}` : null}
                            alt={slide.title || profileName}
                            className="h-full w-full"
                            imgClassName="h-full w-full object-cover"
                            fallbackLabel={profileName}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/78" />
                    </div>
                ))}

                <div className="public-container relative flex min-h-screen flex-col justify-end pb-20 pt-28 md:pb-24">
                    <div className="max-w-4xl space-y-6 drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]" data-reveal>
                        <p className="public-kicker text-white/90">Himpunan Mahasiswa Informatika</p>
                        <h1 className="font-editorial text-6xl leading-[0.92] font-semibold text-white md:text-8xl lg:text-[7rem]">
                            {profileName}
                        </h1>
                        <p className="max-w-2xl text-base leading-8 text-white/95 md:text-lg">
                            {tagline}
                        </p>
                        {cabinetLine ? (
                            <p className="text-sm uppercase tracking-[0.25em] text-white/85">
                                {cabinetLine}
                            </p>
                        ) : null}
                    </div>

                    <div className="mt-16 flex flex-wrap items-end justify-between gap-6" data-reveal>
                        <div className="max-w-xl rounded-2xl border border-white/12 bg-black/28 px-5 py-4 backdrop-blur-sm">
                            <p className="text-sm leading-7 text-white/92">
                                {siteSettings?.site_description || organizationProfile?.description || "Ruang digital resmi HIMASTI untuk publikasi kegiatan, program kerja, dokumentasi, dan informasi organisasi."}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)}
                                className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                                aria-label="Slide sebelumnya"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)}
                                className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                                aria-label="Slide berikutnya"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2" data-reveal>
                        {heroSlides.map((slide, index) => (
                            <button
                                key={slide.id}
                                type="button"
                                aria-label={`Pilih slide ${index + 1}`}
                                onClick={() => setActiveSlide(index)}
                                className={`h-1.5 transition ${index === activeSlide ? "w-10 bg-white" : "w-4 bg-white/35"}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container grid gap-14 lg:grid-cols-[0.92fr_1.08fr]">
                    <div data-reveal>
                        <p className="public-kicker">Arah Organisasi</p>
                        <h2 className="mt-4 font-editorial text-5xl leading-none font-semibold text-black md:text-7xl">
                            Visi &amp; Misi
                        </h2>
                    </div>
                    <div className="grid gap-10">
                        <blockquote className="border-l border-slate-300 pl-6 font-editorial text-3xl leading-tight text-[#1c2032] md:text-5xl" data-reveal>
                            {organizationProfile?.vision || "Membangun ruang tumbuh yang relevan, kolaboratif, dan berdampak bagi mahasiswa Informatika."}
                        </blockquote>
                        <ol className="grid gap-5" data-reveal>
                            {(missionItems.length
                                ? missionItems
                                : [
                                      "Menguatkan budaya belajar, riset, dan kolaborasi antaranggota.",
                                      "Mendorong program kerja yang terukur, terbuka, dan relevan.",
                                      "Menghadirkan karya dan kegiatan yang berdampak bagi lingkungan sekitar.",
                                  ]).map((item, index) => (
                                <li key={`${item}-${index}`} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-slate-200 pt-4">
                                    <span className="font-editorial text-3xl leading-none text-[#1c2032]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <p className="text-sm leading-7 text-slate-600 md:text-base">{item}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            <section className="public-section bg-[#f6f6f2]">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Publikasi"
                            title="Berita Terbaru"
                            description="Sorotan terbaru dari aktivitas, gagasan, dan perkembangan HIMASTI."
                        />
                        <Link href={route("public.news.index")} className="public-link" data-reveal>
                            Lihat Semua Berita
                        </Link>
                    </div>

                    {leadNews ? (
                        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                            <EditorialCard
                                href={route("public.news.show", leadNews.slug)}
                                image={leadNews.cover_image ? `/storage/${leadNews.cover_image}` : null}
                                alt={leadNews.title}
                                eyebrow={formatDate(leadNews.published_at)}
                                title={leadNews.title}
                                description={leadNews.excerpt}
                                imageClassName="aspect-[16/10] w-full object-cover"
                            />
                            <div className="grid gap-8 self-start">
                                {secondaryNews.length ? (
                                    secondaryNews.map((item) => (
                                        <div key={item.id} className="border-t border-slate-200 pt-6" data-reveal>
                                            <Link href={route("public.news.show", item.slug)} className="block space-y-2 focus-visible:ring-2 focus-visible:ring-[#1c2032] focus-visible:ring-offset-2 focus-visible:outline-none">
                                                <p className="public-kicker">{formatDate(item.published_at)}</p>
                                                <h3 className="font-editorial text-3xl leading-tight font-semibold text-[#1c2032]">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm leading-7 text-slate-600">
                                                    {item.excerpt || "Publikasi terbaru dari HIMASTI."}
                                                </p>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyPublicState
                                        title="Berita pendukung belum tersedia"
                                        description="Publikasi berikutnya akan tampil di area ini ketika ada berita tambahan yang sudah diterbitkan."
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada berita terbit"
                            description="Publikasi berita terbaru dari panel admin akan tampil di bagian ini."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Agenda"
                            title="Kegiatan"
                            description="Rangkaian kegiatan terbaru dan mendatang yang sudah dipublikasikan."
                        />
                        <Link href={route("public.event.index")} className="public-link" data-reveal>
                            Lihat Semua Kegiatan
                        </Link>
                    </div>

                    {latestEvents.length ? (
                        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                            {latestEvents.map((item) => (
                                <EditorialCard
                                    key={item.id}
                                    href={route("public.event.show", item.slug)}
                                    image={item.cover_image ? `/storage/${item.cover_image}` : null}
                                    alt={item.title}
                                    eyebrow={item.status ? `${item.status} · ${formatDate(item.start_date)}` : formatDate(item.start_date)}
                                    title={item.title}
                                    description={item.location || "Lokasi akan diumumkan lebih lanjut."}
                                    imageClassName="aspect-[4/5] w-full object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada kegiatan aktif"
                            description="Kegiatan yang dipublikasikan akan muncul di sini secara otomatis."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-[#f7f8fb]">
                <div className="public-container space-y-10">
                    <SectionHeading
                        kicker="Struktur"
                        title="Divisi"
                        description="Identitas setiap divisi HIMASTI beserta ruang kerja dan fokus kontribusinya."
                    />
                    {activeDivisions.length ? (
                        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                            {activeDivisions.map((division) => (
                                <EditorialCard
                                    key={division.id}
                                    href={route("public.division.show", division.slug)}
                                    image={
                                        division.cover_image
                                            ? `/storage/${division.cover_image}`
                                            : division.logo
                                              ? `/storage/${division.logo}`
                                              : null
                                    }
                                    alt={division.name}
                                    eyebrow={division.short_name || "Divisi HIMASTI"}
                                    title={division.name}
                                    description={division.description || "Ringkasan singkat divisi akan ditampilkan di sini."}
                                    imageClassName="aspect-[5/4] w-full object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada divisi aktif"
                            description="Daftar divisi akan ditampilkan setelah diaktifkan melalui panel admin."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Inisiatif"
                            title="Program Kerja"
                            description="Program kerja terbaru yang sudah dipublikasikan dari setiap divisi."
                        />
                        <Link href={route("work-programs.index")} className="public-link" data-reveal>
                            Lihat Semua Program Kerja
                        </Link>
                    </div>

                    {latestWorkPrograms.length ? (
                        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                            {latestWorkPrograms.map((item) => (
                                <EditorialCard
                                    key={item.id}
                                    href={route("work-programs.show", item.slug)}
                                    image={item.cover_image ? `/storage/${item.cover_image}` : null}
                                    alt={item.name}
                                    eyebrow={[item.division?.name, item.year].filter(Boolean).join(" · ")}
                                    title={item.name}
                                    description={item.description}
                                    imageClassName="aspect-[3/4] w-full object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Program kerja belum tersedia"
                            description="Program kerja terbit akan muncul di sini setelah dipublikasikan."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-[#f6f6f2]">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Galeri"
                            title="Dokumentasi"
                            description="Cuplikan visual dari kegiatan dan program kerja terbaru HIMASTI."
                        />
                        <Link href={route("public.documentation.index")} className="public-link" data-reveal>
                            Lihat Semua Dokumentasi
                        </Link>
                    </div>

                    {latestDocumentations.length ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {latestDocumentations.map((item, index) => {
                                const coverImage = item.cover_image
                                    ? `/storage/${item.cover_image}`
                                    : item.images?.[0]?.image
                                      ? `/storage/${item.images[0].image}`
                                      : null;

                                return (
                                    <Link
                                        key={item.id}
                                        href={route("public.documentation.show", item.slug)}
                                        className={`group block focus-visible:ring-2 focus-visible:ring-[#1c2032] focus-visible:ring-offset-2 focus-visible:outline-none ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                                        data-reveal
                                    >
                                        <ImageFallback
                                            src={coverImage}
                                            alt={item.title}
                                            className="overflow-hidden bg-slate-100"
                                            imgClassName={`w-full object-cover transition duration-500 group-hover:scale-[1.02] ${index === 0 ? "aspect-[16/11]" : "aspect-[4/5]"}`}
                                            fallbackLabel={item.title}
                                        />
                                        <div className="space-y-2 bg-white px-1 pt-4">
                                            <p className="public-kicker">
                                                {[formatDate(item.event_date), item.location].filter(Boolean).join(" · ")}
                                            </p>
                                            <h3 className="font-editorial text-3xl leading-tight font-semibold text-[#1c2032]">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Dokumentasi belum tersedia"
                            description="Galeri kegiatan terbaru akan tampil di sini setelah diunggah dari admin."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <SectionHeading
                        kicker="Instagram"
                        title="Postingan Terbaru"
                        description="Cuplikan visual dari akun Instagram HIMASTI yang dikelola manual melalui admin."
                    />
                    {visibleInstagramPosts.length ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {visibleInstagramPosts.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block focus-visible:ring-2 focus-visible:ring-[#1c2032] focus-visible:ring-offset-2 focus-visible:outline-none"
                                    data-reveal
                                >
                                    <ImageFallback
                                        src={item.image ? `/storage/${item.image}` : null}
                                        alt={item.title || "Postingan Instagram HIMASTI"}
                                        className="overflow-hidden bg-slate-100"
                                        imgClassName="aspect-[4/5] w-full object-contain bg-white p-3 transition duration-300 group-hover:opacity-85"
                                        fallbackLabel="Instagram"
                                    />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada postingan Instagram"
                            description="Postingan Instagram yang ditandai tampil akan muncul di sini."
                        />
                    )}
                </div>
            </section>

            {activeServices.length ? (
                <section className="border-t border-slate-200 bg-white">
                    <div className="public-container flex flex-wrap gap-x-8 gap-y-4 py-8">
                        <p className="public-kicker w-full">Layanan Terkait</p>
                        {activeServices.map((service) => (
                            <a
                                key={service.id}
                                href={service.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="public-link"
                                data-reveal
                            >
                                {service.name}
                                <ExternalLink className="size-4" />
                            </a>
                        ))}
                    </div>
                </section>
            ) : null}
        </PublicLayout>
    );
}
