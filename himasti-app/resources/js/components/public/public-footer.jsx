import { resolvePublicLogo } from "@/lib/public-brand";
import { Link, usePage } from "@inertiajs/react";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { route } from "ziggy-js";

const quickLinks = [
    { label: "Beranda", href: () => route("public.home") },
    { label: "Berita", href: () => route("public.news.index") },
    { label: "Kegiatan", href: () => route("public.event.index") },
    { label: "Divisi", href: () => route("public.division.index") },
    { label: "Program Kerja", href: () => route("work-programs.index") },
    { label: "Dokumentasi", href: () => route("public.documentation.index") },
    { label: "Layanan", href: () => route("public.service.index") },
];

export default function PublicFooter() {
    const { publicIdentity, publicProfileMeta } = usePage().props;
    const organizationName =
        publicProfileMeta?.short_name ||
        publicIdentity?.site_title ||
        "HIMASTI";
    const logoSrc = resolvePublicLogo(publicProfileMeta);
    const configuredFooter = publicIdentity?.footer_text?.trim();
    const copyrightText = configuredFooter
        ? configuredFooter.replace(
              /^\(c\)\s*/i,
              `© ${new Date().getFullYear()} `,
          )
        : `© ${new Date().getFullYear()} ${organizationName}. Seluruh hak cipta dilindungi.`;

    return (
        <footer className="bg-[#1C2032] text-white">
            <div className="public-container grid gap-12 py-16 lg:grid-cols-[1.2fr_0.7fr_0.9fr]">
                <div data-reveal>
                    <div className="flex flex-col items-start gap-4">
                        <img
                            src={logoSrc}
                            alt={organizationName}
                            className="h-20 w-auto max-w-[17rem] object-contain brightness-0 invert"
                        />
                        {publicProfileMeta?.period ? (
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                                Periode {publicProfileMeta.period}
                            </p>
                        ) : null}
                    </div>
                    {publicIdentity?.site_description ? (
                        <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">
                            {publicIdentity.site_description}
                        </p>
                    ) : null}
                </div>

                <div data-reveal>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                        Navigasi
                    </p>
                    <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-1">
                        {quickLinks.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href()}
                                    className="text-sm text-white/70 transition hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div data-reveal>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                        Hubungi Kami
                    </p>
                    <div className="mt-5 space-y-4 text-sm text-white/70">
                        {publicProfileMeta?.address ? (
                            <div className="flex gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-white/45" />
                                <p className="leading-6">
                                    {publicProfileMeta.address}
                                </p>
                            </div>
                        ) : null}
                        {publicIdentity?.contact_email ? (
                            <a
                                href={`mailto:${publicIdentity.contact_email}`}
                                className="flex gap-3 transition hover:text-white"
                            >
                                <Mail className="size-4 shrink-0 text-white/45" />
                                <span>{publicIdentity.contact_email}</span>
                            </a>
                        ) : null}
                        {publicIdentity?.contact_phone ? (
                            <a
                                href={`tel:${publicIdentity.contact_phone}`}
                                className="flex gap-3 transition hover:text-white"
                            >
                                <Phone className="size-4 shrink-0 text-white/45" />
                                <span>{publicIdentity.contact_phone}</span>
                            </a>
                        ) : null}
                        {publicIdentity?.instagram_url ? (
                            <a
                                href={publicIdentity.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-3 transition hover:text-white"
                            >
                                <Instagram className="size-4 shrink-0 text-white/45" />
                                <span>Instagram HIMASTI</span>
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="public-container flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
                    <p>{copyrightText}</p>
                    <p>Website resmi organisasi mahasiswa Informatika.</p>
                </div>
            </div>
        </footer>
    );
}
