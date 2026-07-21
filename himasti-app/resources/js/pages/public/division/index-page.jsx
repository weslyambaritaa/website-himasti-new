import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import PaginationLinks from "@/components/public/pagination-links";
import PublicLayout from "@/components/public/public-layout";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function DivisionIndexPage() {
    const { divisions } = usePage().props;

    return (
        <PublicLayout pageHeader={{ kicker: "Struktur Organisasi", title: "Divisi", description: "Kenali struktur divisi HIMASTI, fokus kerja, dan anggota yang menjalankan setiap inisiatif." }}>
            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    {divisions.data.length ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {divisions.data.map((item) => (
                                    <EditorialCard
                                        key={item.id}
                                        href={route("public.division.show", item.slug)}
                                        image={item.cover_image ? `/storage/${item.cover_image}` : item.logo ? `/storage/${item.logo}` : null}
                                        alt={item.name}
                                        eyebrow={item.short_name || "Divisi HIMASTI"}
                                        title={item.name}
                                        description={item.description}
                                        meta={`${item.members_count ?? 0} anggota aktif`}
                                        imageClassName="aspect-[16/10] w-full object-cover"
                                        containImage={!item.cover_image && !!item.logo}
                                    />
                                ))}
                            </div>
                            <PaginationLinks links={divisions.links} />
                        </>
                    ) : <EmptyPublicState title="Belum ada divisi aktif" description="Divisi aktif akan muncul di sini setelah datanya tersedia." />}
                </div>
            </section>
        </PublicLayout>
    );
}
