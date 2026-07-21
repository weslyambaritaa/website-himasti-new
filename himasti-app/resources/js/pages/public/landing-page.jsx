import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import SectionHeading from "@/components/public/section-heading";
import { Link, usePage } from "@inertiajs/react";
import {
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Globe2,
    GraduationCap,
    Link2,
} from "lucide-react";
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
    if (!mission) return [];
    return mission
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function ServiceIcon({ name }) {
    const iconName = (name ?? "").toLowerCase();
    const Icon =
        iconName.includes("globe") || iconName.includes("web")
            ? Globe2
            : iconName.includes("book") || iconName.includes("pustaka")
              ? BookOpen
              : iconName.includes("graduate") || iconName.includes("academic")
                ? GraduationCap
                : iconName.includes("briefcase") || iconName.includes("career")
                  ? BriefcaseBusiness
                  : Link2;

    return <Icon className="size-6" />;
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

    const profileName =
        organizationProfile?.organization_name ||
        "Himpunan Mahasiswa Informatika";
    const tagline =
        organizationProfile?.tagline ||
        "Ruang tumbuh, berkarya, dan berkolaborasi.";
    const cabinetLine = [
        organizationProfile?.cabinet_name,
        organizationProfile?.period,
    ]
        .filter(Boolean)
        .join(" · ");
    const heroSlides = banners.length
        ? banners
        : [
              {
                  id: "fallback",
                  image: null,
                  title: profileName,
                  subtitle: tagline,
              },
          ];
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const activeHero = heroSlides[activeSlide] ?? heroSlides[0];
    const missionItems = formatMissionItems(organizationProfile?.mission);
    const leadNews = latestNews[0] ?? null;
    const secondaryNews = latestNews.slice(1, 3);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );
        const updatePreference = () =>
            setPrefersReducedMotion(mediaQuery.matches);
        updatePreference();
        mediaQuery.addEventListener("change", updatePreference);
        return () => mediaQuery.removeEventListener("change", updatePreference);
    }, []);

    useEffect(() => {
        if (heroSlides.length <= 1 || isPaused || prefersReducedMotion)
            return undefined;
        const timer = window.setInterval(
            () =>
                setActiveSlide((current) => (current + 1) % heroSlides.length),
            6500,
        );
        return () => window.clearInterval(timer);
    }, [heroSlides.length, isPaused, prefersReducedMotion]);

    return (
        <PublicLayout
            overlayNavbar
            title="Beranda"
            description={
                siteSettings?.default_meta_description ||
                siteSettings?.site_description
            }
            mainClassName="overflow-x-hidden"
        >
            <section
                className="relative min-h-[760px] overflow-hidden bg-[#1C2032] text-white md:min-h-screen"
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
                        <div className="absolute inset-0 bg-[#1C2032]/72" />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,#1C2032_0%,rgba(28,32,50,.88)_38%,rgba(28,32,50,.3)_100%)]" />
                    </div>
                ))}
                <div
                    className="absolute inset-0 opacity-30 public-grid-pattern"
                    aria-hidden="true"
                />

                <div className="public-container relative flex min-h-[760px] flex-col justify-center pb-24 pt-36 md:min-h-screen md:pt-40">
                    <div className="max-w-4xl" data-reveal>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
                            {cabinetLine || "Himpunan Mahasiswa Informatika"}
                        </div>
                        <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl md:text-7xl lg:text-[5.5rem]">
                            {activeHero?.title || profileName}
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                            {activeHero?.subtitle || tagline}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {activeHero?.button_text &&
                            activeHero?.button_url ? (
                                <a
                                    href={activeHero.button_url}
                                    target={
                                        activeHero.button_url.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        activeHero.button_url.startsWith("http")
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1C2032] transition hover:-translate-y-0.5 hover:bg-white/90"
                                >
                                    {activeHero.button_text}
                                    <ArrowRight className="size-4" />
                                </a>
                            ) : (
                                <Link
                                    href={route("public.news.index")}
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1C2032] transition hover:-translate-y-0.5 hover:bg-white/90"
                                >
                                    Jelajahi Informasi{" "}
                                    <ArrowRight className="size-4" />
                                </Link>
                            )}
                            <Link
                                href={route("public.division.index")}
                                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Kenali Divisi
                            </Link>
                        </div>
                    </div>

                    <div className="absolute inset-x-5 bottom-7 flex items-center justify-between gap-4 md:inset-x-8 lg:inset-x-10">
                        <div className="flex items-center gap-2">
                            {heroSlides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    aria-label={`Pilih slide ${index + 1}`}
                                    onClick={() => setActiveSlide(index)}
                                    className={`h-1 rounded-full transition-all ${index === activeSlide ? "w-10 bg-white" : "w-4 bg-white/30 hover:bg-white/55"}`}
                                />
                            ))}
                        </div>
                        {heroSlides.length > 1 ? (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveSlide(
                                            (activeSlide -
                                                1 +
                                                heroSlides.length) %
                                                heroSlides.length,
                                        )
                                    }
                                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:bg-white/15"
                                    aria-label="Slide sebelumnya"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveSlide(
                                            (activeSlide + 1) %
                                                heroSlides.length,
                                        )
                                    }
                                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:bg-white/15"
                                    aria-label="Slide berikutnya"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                    <div data-reveal>
                        <p className="public-kicker">Tentang Organisasi</p>
                        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#1C2032] md:text-5xl">
                            Bertumbuh bersama melalui karya dan kolaborasi.
                        </h2>
                    </div>
                    <div
                        className="rounded-3xl bg-[#F4F6FA] p-7 md:p-10"
                        data-reveal
                    >
                        <p className="text-base leading-8 text-slate-700 md:text-lg">
                            {organizationProfile?.description ||
                                siteSettings?.site_description ||
                                "HIMASTI menjadi ruang bagi mahasiswa Informatika untuk belajar, berorganisasi, mengembangkan potensi, dan menghadirkan dampak positif melalui berbagai program kerja."}
                        </p>
                        {cabinetLine ? (
                            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#1C2032]">
                                {cabinetLine}
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>

            <section className="public-section bg-[#F4F6FA]">
                <div className="public-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                    <SectionHeading
                        kicker="Arah Organisasi"
                        title="Visi & Misi"
                        description="Arah bersama yang menjadi dasar dalam merancang kegiatan dan program kerja HIMASTI."
                    />
                    <div className="space-y-8">
                        <div
                            className="rounded-3xl bg-[#1C2032] p-7 text-white md:p-10"
                            data-reveal
                        >
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                                Visi
                            </p>
                            <blockquote className="mt-5 text-2xl font-bold leading-relaxed tracking-[-0.025em] md:text-3xl">
                                {organizationProfile?.vision ||
                                    "Membangun ruang tumbuh yang relevan, kolaboratif, dan berdampak bagi mahasiswa Informatika."}
                            </blockquote>
                        </div>
                        <ol className="grid gap-4">
                            {(missionItems.length
                                ? missionItems
                                : [
                                      "Menguatkan budaya belajar dan kolaborasi antaranggota.",
                                      "Mendorong program kerja yang terukur, terbuka, dan relevan.",
                                      "Menghadirkan karya yang bermanfaat bagi lingkungan sekitar.",
                                  ]
                            ).map((item, index) => (
                                <li
                                    key={`${item}-${index}`}
                                    className="grid grid-cols-[3rem_1fr] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                                    data-reveal
                                >
                                    <span className="flex size-10 items-center justify-center rounded-full bg-[#1C2032] text-sm font-bold text-white">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <p className="pt-1 text-sm leading-7 text-slate-700 md:text-base">
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Publikasi"
                            title="Berita Terbaru"
                            description="Informasi resmi, catatan kegiatan, dan kabar terbaru dari HIMASTI."
                        />
                        <Link
                            href={route("public.news.index")}
                            className="public-link"
                            data-reveal
                        >
                            Lihat Semua <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {leadNews ? (
                        <div
                            className={
                                secondaryNews.length
                                    ? "grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]"
                                    : "max-w-5xl"
                            }
                        >
                            <Link
                                href={route("public.news.show", leadNews.slug)}
                                className="group relative min-h-[420px] overflow-hidden rounded-3xl bg-[#1C2032] md:min-h-[500px]"
                                data-reveal
                            >
                                <ImageFallback
                                    src={
                                        leadNews.cover_image
                                            ? `/storage/${leadNews.cover_image}`
                                            : null
                                    }
                                    alt={leadNews.title}
                                    className="absolute inset-0 h-full w-full"
                                    imgClassName="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    fallbackLabel={leadNews.title}
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,32,50,.96),rgba(28,32,50,.08)_78%)]" />
                                <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                                        {formatDate(leadNews.published_at) ||
                                            "Berita HIMASTI"}
                                    </p>
                                    <h3 className="mt-4 max-w-3xl text-2xl font-extrabold leading-tight tracking-[-0.03em] md:text-4xl">
                                        {leadNews.title}
                                    </h3>
                                    {leadNews.excerpt ? (
                                        <p className="mt-4 max-w-2xl line-clamp-3 text-sm leading-7 text-white/72">
                                            {leadNews.excerpt}
                                        </p>
                                    ) : null}
                                </div>
                            </Link>

                            {secondaryNews.length ? (
                                <div className="grid content-start gap-5">
                                    {secondaryNews.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route(
                                                "public.news.show",
                                                item.slug,
                                            )}
                                            className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(28,32,50,0.05)] transition hover:-translate-y-0.5 hover:border-[#1C2032]/25 hover:shadow-[0_20px_50px_rgba(28,32,50,0.1)] sm:grid-cols-[0.42fr_0.58fr]"
                                            data-reveal
                                        >
                                            <ImageFallback
                                                src={
                                                    item.cover_image
                                                        ? `/storage/${item.cover_image}`
                                                        : null
                                                }
                                                alt={item.title}
                                                className="min-h-48 overflow-hidden bg-[#F4F6FA] sm:min-h-full"
                                                imgClassName="h-full min-h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                                                fallbackLabel={item.title}
                                            />
                                            <div className="flex min-w-0 flex-col p-5 md:p-6">
                                                <p className="public-kicker">
                                                    {formatDate(
                                                        item.published_at,
                                                    ) || "Berita"}
                                                </p>
                                                <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-[#1C2032] group-hover:underline group-hover:underline-offset-4 md:text-xl">
                                                    {item.title}
                                                </h3>
                                                {item.excerpt ? (
                                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                                                        {item.excerpt}
                                                    </p>
                                                ) : null}
                                                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#1C2032]">
                                                    Baca berita{" "}
                                                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada berita"
                            description="Berita yang telah diterbitkan akan muncul di sini."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-[#F4F6FA]">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Agenda"
                            title="Kegiatan"
                            description="Kegiatan unggulan, agenda mendatang, dan aktivitas terbaru HIMASTI."
                        />
                        <Link
                            href={route("public.event.index")}
                            className="public-link"
                            data-reveal
                        >
                            Lihat Semua <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {latestEvents.length ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {latestEvents.map((item) => (
                                <EditorialCard
                                    key={item.id}
                                    href={route("public.event.show", item.slug)}
                                    image={
                                        item.cover_image
                                            ? `/storage/${item.cover_image}`
                                            : null
                                    }
                                    alt={item.title}
                                    eyebrow={[
                                        item.status,
                                        formatDate(item.start_date),
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    title={item.title}
                                    description={
                                        item.location || item.description
                                    }
                                    badge={
                                        item.is_featured
                                            ? "Kegiatan Unggulan"
                                            : null
                                    }
                                    imageClassName="aspect-[16/11] w-full object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada kegiatan"
                            description="Kegiatan yang dipublikasikan akan tampil di sini."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Struktur Organisasi"
                            title="Divisi HIMASTI"
                            description="Kenali peran dan ruang kerja setiap divisi dalam menjalankan organisasi."
                        />
                        <Link
                            href={route("public.division.index")}
                            className="public-link"
                            data-reveal
                        >
                            Semua Divisi <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {activeDivisions.length ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {activeDivisions.map((division) => (
                                <EditorialCard
                                    key={division.id}
                                    href={route(
                                        "public.division.show",
                                        division.slug,
                                    )}
                                    image={
                                        division.cover_image
                                            ? `/storage/${division.cover_image}`
                                            : division.logo
                                              ? `/storage/${division.logo}`
                                              : null
                                    }
                                    alt={division.name}
                                    eyebrow={
                                        division.short_name || "Divisi HIMASTI"
                                    }
                                    title={division.name}
                                    description={
                                        division.description ||
                                        "Informasi divisi HIMASTI."
                                    }
                                    imageClassName="aspect-[16/10] w-full object-cover"
                                    containImage={
                                        !division.cover_image && !!division.logo
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada divisi aktif"
                            description="Daftar divisi akan tampil setelah diaktifkan dari panel admin."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-[#F4F6FA]">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Inisiatif"
                            title="Program Kerja"
                            description="Program kerja terbaru dan unggulan dari setiap divisi HIMASTI."
                        />
                        <Link
                            href={route("work-programs.index")}
                            className="public-link"
                            data-reveal
                        >
                            Lihat Semua <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {latestWorkPrograms.length ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {latestWorkPrograms.map((item) => (
                                <EditorialCard
                                    key={item.id}
                                    href={route(
                                        "work-programs.show",
                                        item.slug,
                                    )}
                                    image={
                                        item.cover_image
                                            ? `/storage/${item.cover_image}`
                                            : null
                                    }
                                    alt={item.name}
                                    eyebrow={[item.division?.name, item.year]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    title={item.name}
                                    description={item.description}
                                    badge={
                                        item.is_featured
                                            ? "Program Unggulan"
                                            : null
                                    }
                                    imageClassName="aspect-[16/11] w-full object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Program kerja belum tersedia"
                            description="Program kerja terbit akan muncul di sini."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            kicker="Galeri"
                            title="Dokumentasi"
                            description="Rekam jejak visual dari kegiatan dan program kerja HIMASTI."
                        />
                        <Link
                            href={route("public.documentation.index")}
                            className="public-link"
                            data-reveal
                        >
                            Lihat Galeri <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {latestDocumentations.length ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {latestDocumentations.map((item) => {
                                const image = item.cover_image
                                    ? `/storage/${item.cover_image}`
                                    : item.images?.[0]?.image
                                      ? `/storage/${item.images[0].image}`
                                      : null;
                                const meta =
                                    [formatDate(item.event_date), item.location]
                                        .filter(Boolean)
                                        .join(" · ") || "Dokumentasi";

                                return (
                                    <Link
                                        key={item.id}
                                        href={route(
                                            "public.documentation.show",
                                            item.slug,
                                        )}
                                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(28,32,50,0.05)] transition hover:-translate-y-1 hover:border-[#1C2032]/25 hover:shadow-[0_22px_55px_rgba(28,32,50,0.1)]"
                                        data-reveal
                                    >
                                        <ImageFallback
                                            src={image}
                                            alt={item.title}
                                            className="aspect-[4/3] overflow-hidden bg-[#F4F6FA] p-3"
                                            imgClassName="h-full w-full object-contain transition duration-500 group-hover:scale-[1.025]"
                                            fallbackLabel={item.title}
                                        />
                                        <div className="p-5 md:p-6">
                                            <p className="public-kicker">
                                                {meta}
                                            </p>
                                            <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.02em] text-[#1C2032] md:text-2xl">
                                                {item.title}
                                            </h3>
                                            {item.description ? (
                                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1C2032]">
                                                Buka galeri{" "}
                                                <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Dokumentasi belum tersedia"
                            description="Galeri kegiatan terbaru akan tampil di sini."
                        />
                    )}
                </div>
            </section>

            <section className="public-section bg-[#F4F6FA]">
                <div className="public-container space-y-10">
                    <SectionHeading
                        kicker="Media Sosial"
                        title="Instagram Terbaru"
                        description="Ikuti informasi dan dokumentasi terbaru melalui Instagram HIMASTI."
                    />
                    {instagramPosts.length ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {instagramPosts.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                    data-reveal
                                >
                                    <ImageFallback
                                        src={
                                            item.image
                                                ? `/storage/${item.image}`
                                                : null
                                        }
                                        alt={
                                            item.title ||
                                            "Postingan Instagram HIMASTI"
                                        }
                                        className="overflow-hidden bg-slate-100"
                                        imgClassName="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                                        fallbackLabel="Instagram"
                                    />
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-bold leading-snug text-[#1C2032]">
                                                    {item.title ||
                                                        "Postingan HIMASTI"}
                                                </p>
                                                <p className="mt-2 text-xs text-slate-500">
                                                    {formatDate(
                                                        item.published_at,
                                                    ) || "Instagram"}
                                                </p>
                                            </div>
                                            <ExternalLink className="size-4 shrink-0 text-slate-400 group-hover:text-[#1C2032]" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada postingan Instagram"
                            description="Postingan yang ditandai tampil akan muncul di sini."
                        />
                    )}
                </div>
            </section>

            {activeServices.length ? (
                <section className="public-section bg-white">
                    <div className="public-container space-y-10">
                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <SectionHeading
                                kicker="Akses Cepat"
                                title="Layanan"
                                description="Tautan layanan dan sumber daya yang dapat diakses oleh anggota maupun pengunjung."
                            />
                            <Link
                                href={route("public.service.index")}
                                className="public-link"
                                data-reveal
                            >
                                Semua Layanan <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {activeServices.slice(0, 6).map((service) => (
                                <a
                                    key={service.id}
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex min-h-44 items-start gap-5 rounded-2xl border border-slate-200 p-6 transition hover:border-[#1C2032]/30 hover:shadow-xl"
                                    data-reveal
                                >
                                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#1C2032] text-white">
                                        {service.logo ? (
                                            <img
                                                src={`/storage/${service.logo}`}
                                                alt={`Logo ${service.name}`}
                                                className="h-full w-full bg-white object-contain p-2"
                                            />
                                        ) : (
                                            <ServiceIcon name={service.icon} />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-lg font-bold text-[#1C2032]">
                                                {service.name}
                                            </h3>
                                            <ExternalLink className="size-4 shrink-0 text-slate-400 group-hover:text-[#1C2032]" />
                                        </div>
                                        {service.description ? (
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                                                {service.description}
                                            </p>
                                        ) : null}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </PublicLayout>
    );
}
