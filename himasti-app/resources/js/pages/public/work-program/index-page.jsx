import EditorialCard from "@/components/public/editorial-card";
import EmptyPublicState from "@/components/public/empty-public-state";
import PaginationLinks from "@/components/public/pagination-links";
import PublicLayout from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function PublicWorkProgramIndexPage() {
    const { workPrograms, divisions, years, filters } = usePage().props;
    const { data, setData, get } = useForm({
        division_id: filters?.division_id ?? "",
        year: filters?.year ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("work-programs.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout
            pageHeader={{
                kicker: "Inisiatif",
                title: "Program Kerja",
                description: "Program kerja resmi HIMASTI yang telah dipublikasikan.",
            }}
        >
            <section className="public-section bg-white">
                <div className="public-container space-y-10">
                    <form onSubmit={submit} className="grid gap-4 border border-line bg-mist p-5 md:grid-cols-3" data-reveal>
                        <Select value={data.division_id || "all"} onValueChange={(value) => setData("division_id", value === "all" ? "" : value)}>
                            <SelectTrigger className="rounded-none border-line bg-white">
                                <SelectValue placeholder="Semua divisi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua divisi</SelectItem>
                                {divisions.map((division) => (
                                    <SelectItem key={division.id} value={division.id.toString()}>
                                        {division.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={data.year || "all"} onValueChange={(value) => setData("year", value === "all" ? "" : value)}>
                            <SelectTrigger className="rounded-none border-line bg-white">
                                <SelectValue placeholder="Semua tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua tahun</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit" className="btn-volt rounded-none font-semibold">
                            Terapkan Filter
                        </Button>
                    </form>

                    {workPrograms.data.length ? (
                        <>
                            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                                {workPrograms.data.map((item) => (
                                    <EditorialCard
                                        key={item.id}
                                        href={route("work-programs.show", item.slug)}
                                        image={item.cover_image ? `/storage/${item.cover_image}` : null}
                                        alt={item.name}
                                        eyebrow={[item.division?.name, item.year].filter(Boolean).join(" · ")}
                                        title={item.name}
                                        description={item.description}
                                        meta={item.start_date ? dateFormatter.format(new Date(item.start_date)) : item.status}
                                        imageClassName="aspect-[4/5] w-full object-cover"
                                    />
                                ))}
                            </div>
                            <PaginationLinks links={workPrograms.links} />
                        </>
                    ) : (
                        <EmptyPublicState
                            title="Belum ada program kerja"
                            description="Coba ubah filter atau tunggu hingga program kerja dipublikasikan."
                        />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
