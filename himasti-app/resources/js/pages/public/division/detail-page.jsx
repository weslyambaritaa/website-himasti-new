import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import SectionHeading from "@/components/public/section-heading";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function DivisionDetailPage() {
    const { division } = usePage().props;

    return (
        <PublicLayout pageHeader={{ kicker: division.short_name || "Divisi", title: division.name, description: division.description || "Profil divisi HIMASTI." }}>
            <section className="public-section bg-white">
                <div className="public-container space-y-14">
                    <Link href={route("public.division.index")} className="public-link" data-reveal>Kembali ke Divisi</Link>

                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <ImageFallback
                            src={division.cover_image ? `/storage/${division.cover_image}` : division.logo ? `/storage/${division.logo}` : null}
                            alt={division.name}
                            className="overflow-hidden rounded-3xl bg-[#F4F6FA] shadow-[0_18px_55px_rgba(28,32,50,0.08)]"
                            imgClassName={`aspect-[4/3] w-full ${division.cover_image ? "object-cover" : "object-contain bg-white p-10"}`}
                            fallbackLabel={division.short_name || division.name}
                        />
                        <div className="rounded-3xl bg-[#F4F6FA] p-7 md:p-10" data-reveal>
                            <p className="public-kicker">Tentang Divisi</p>
                            <p className="mt-5 text-base leading-8 whitespace-pre-line text-slate-700">{division.description || "Belum ada deskripsi divisi."}</p>
                            <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-6">
                                <span className="text-3xl font-extrabold text-[#1C2032]">{division.members.length}</span>
                                <span className="text-sm leading-5 text-slate-500">anggota aktif<br />pada periode ini</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <SectionHeading kicker="Tim" title="Anggota Divisi" description="Personel aktif yang menjalankan tanggung jawab dan program divisi." />
                        {division.members.length ? (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {division.members.map((member) => (
                                    <article key={member.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-reveal>
                                        <ImageFallback
                                            src={member.photo ? `/storage/${member.photo}` : null}
                                            alt={member.name}
                                            className="overflow-hidden bg-[#F4F6FA]"
                                            imgClassName="aspect-square w-full object-cover"
                                            fallbackLabel={member.name}
                                        />
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-[#1C2032]">{member.name}</h3>
                                            <p className="mt-2 text-sm text-slate-600">{member.position || "Anggota Divisi"}</p>
                                            {member.period ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{member.period}</p> : null}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : <EmptyPublicState title="Belum ada anggota aktif" description="Data anggota aktif divisi ini belum tersedia." />}
                    </div>

                    <div className="space-y-8">
                        <SectionHeading kicker="Inisiatif" title="Program Kerja" description="Program kerja yang telah dipublikasikan oleh divisi ini." />
                        {division.work_programs.length ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {division.work_programs.map((workProgram) => (
                                    <EditorialCard
                                        key={workProgram.id}
                                        href={route("work-programs.show", workProgram.slug)}
                                        image={workProgram.cover_image ? `/storage/${workProgram.cover_image}` : null}
                                        alt={workProgram.name}
                                        eyebrow={[workProgram.year, workProgram.status].filter(Boolean).join(" · ")}
                                        title={workProgram.name}
                                        description={workProgram.description}
                                        badge={workProgram.is_featured ? "Program Unggulan" : null}
                                        meta={workProgram.start_date ? dateFormatter.format(new Date(workProgram.start_date)) : null}
                                        imageClassName="aspect-[16/11] w-full object-cover"
                                    />
                                ))}
                            </div>
                        ) : <EmptyPublicState title="Belum ada program kerja terbit" description="Program kerja yang dipublikasikan untuk divisi ini akan muncul di sini." />}
                    </div>

                    {division.work_programs.some((item) => item.documentations?.length) ? (
                        <div className="space-y-8">
                            <SectionHeading kicker="Galeri" title="Dokumentasi Terkait" />
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {division.work_programs.flatMap((workProgram) => (workProgram.documentations ?? []).map((documentation) => (
                                    <EditorialCard
                                        key={`doc-${documentation.id}`}
                                        href={route("public.documentation.show", documentation.slug)}
                                        image={documentation.cover_image ? `/storage/${documentation.cover_image}` : documentation.images?.[0]?.image ? `/storage/${documentation.images[0].image}` : null}
                                        alt={documentation.title}
                                        eyebrow={documentation.event_date ? dateFormatter.format(new Date(documentation.event_date)) : workProgram.name}
                                        title={documentation.title}
                                        description={documentation.location}
                                    />
                                )))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </PublicLayout>
    );
}
