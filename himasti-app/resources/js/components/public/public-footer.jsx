import ImageFallback from "@/components/public/image-fallback";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const quickLinks = [
    { label: "Beranda", href: () => route("public.home") },
    { label: "Berita", href: () => route("public.news.index") },
    { label: "Kegiatan", href: () => route("public.event.index") },
    { label: "Divisi", href: () => route("public.division.index") },
    { label: "Program Kerja", href: () => route("work-programs.index") },
    { label: "Dokumentasi", href: () => route("public.documentation.index") },
];

export default function PublicFooter() {
    const { publicIdentity, publicProfileMeta } = usePage().props;

    return (
        <footer className="bg-ink text-white">
            <div className="public-container grid gap-12 py-14 md:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-6" data-reveal>
                    <div className="flex items-start gap-5">
                        <ImageFallback
                            src={publicProfileMeta?.logo ? `/storage/${publicProfileMeta.logo}` : null}
                            alt={publicIdentity?.site_title ?? "Logo HIMASTI"}
                            className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-white/10"
                            imgClassName="h-full w-full object-contain bg-white p-2"
                            fallbackLabel={publicProfileMeta?.short_name ?? "HIMASTI"}
                        />
                        <div className="space-y-2">
                            <p className="font-editorial text-4xl leading-none font-semibold">
                                {publicIdentity?.site_title ?? "HIMASTI"}
                            </p>
                            {publicIdentity?.site_description ? (
                                <p className="max-w-2xl text-sm leading-7 text-slate-300">
                                    {publicIdentity.site_description}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="space-y-1 text-sm leading-7 text-slate-300">
                        {publicProfileMeta?.address ? <p>{publicProfileMeta.address}</p> : null}
                        {publicIdentity?.contact_email ? <p>Email: {publicIdentity.contact_email}</p> : null}
                        {publicIdentity?.contact_phone ? <p>Telepon: {publicIdentity.contact_phone}</p> : null}
                        {publicIdentity?.instagram_url ? (
                            <p>
                                <a
                                    href={publicIdentity.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4 hover:text-white"
                                >
                                    Instagram
                                </a>
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2" data-reveal>
                    <div>
                        <p className="public-kicker text-slate-400">Navigasi Cepat</p>
                        <ul className="mt-5 space-y-3">
                            {quickLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href()} className="text-sm text-slate-200 transition hover:text-white">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="public-kicker text-slate-400">Informasi</p>
                        <p className="mt-5 text-sm leading-7 text-slate-300">
                            {publicIdentity?.footer_text ?? "(c) HIMASTI"}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
