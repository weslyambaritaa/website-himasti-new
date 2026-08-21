import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import ImageFallback from "@/components/public/image-fallback";
import PublicLayout from "@/components/public/public-layout";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function DivisionDetailPage() {
    const { division } = usePage().props;

    return (
        <PublicLayout
            pageHeader={{
                kicker: division.short_name || "Divisi",
                title: division.name,
                description: division.description || "Profil divisi HIMASTI.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-12">
                    <Link href={route("public.division.index")} className="public-link" data-reveal>
                        Kembali ke Divisi
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                        <ImageFallback
                            src={division.cover_image ? `/storage/${division.cover_image}` : division.logo ? `/storage/${division.logo}` : null}
                            alt={division.name}
                            className="overflow-hidden bg-slate-100"
                            imgClassName="aspect-[4/5] w-full object-cover"
                            fallbackLabel={division.short_name || division.name}
                        />
                        <div className="space-y-8">
                            <article className="text-sm leading-8 whitespace-pre-line text-slate-700 md:text-base" data-reveal>
                                {division.description || "Belum ada deskripsi divisi."}
                            </article>

                            <div className="space-y-5" data-reveal>
                                <p className="public-kicker">Anggota Aktif</p>
                                {division.members.length ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {division.members.map((member) => (
                                            <div key={member.id} className="group border-t-2 border-line pt-4 transition duration-300 hover:border-volt">
                                                <p className="font-editorial text-3xl leading-none text-ink transition duration-300 group-hover:text-volt-deep">
                                                    {member.name}
                                                </p>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {member.position || "Anggota Divisi"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyPublicState
                                        title="Belum ada anggota aktif"
                                        description="Data anggota aktif divisi ini belum tersedia."
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="font-editorial text-4xl font-semibold text-ink" data-reveal>
                            Program Kerja
                        </h2>
                        {division.work_programs.length ? (
                            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                                {division.work_programs.map((workProgram) => (
                                    <EditorialCard
                                        key={workProgram.id}
                                        href={route("work-programs.show", workProgram.slug)}
                                        image={workProgram.cover_image ? `/storage/${workProgram.cover_image}` : null}
                                        alt={workProgram.name}
                                        eyebrow={[workProgram.year, workProgram.status].filter(Boolean).join(" · ")}
                                        title={workProgram.name}
                                        description={workProgram.description}
                                        meta={workProgram.start_date ? dateFormatter.format(new Date(workProgram.start_date)) : null}
                                        imageClassName="aspect-[4/5] w-full object-cover"
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyPublicState
                                title="Belum ada program kerja terbit"
                                description="Program kerja yang dipublikasikan untuk divisi ini akan muncul di sini."
                            />
                        )}
                    </div>

                    {division.work_programs.some((item) => item.documentations?.length) ? (
                        <div className="space-y-8">
                            <h2 className="font-editorial text-4xl font-semibold text-ink" data-reveal>
                                Dokumentasi Terkait
                            </h2>
                            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                {division.work_programs.flatMap((workProgram) =>
                                    (workProgram.documentations ?? []).map((documentation) => (
                                        <EditorialCard
                                            key={`doc-${documentation.id}`}
                                            href={route("public.documentation.show", documentation.slug)}
                                            image={
                                                documentation.cover_image
                                                    ? `/storage/${documentation.cover_image}`
                                                    : documentation.images?.[0]?.image
                                                      ? `/storage/${documentation.images[0].image}`
                                                      : null
                                            }
                                            alt={documentation.title}
                                            eyebrow={documentation.event_date ? dateFormatter.format(new Date(documentation.event_date)) : workProgram.name}
                                            title={documentation.title}
                                            description={documentation.location}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </PublicLayout>
    );
}
