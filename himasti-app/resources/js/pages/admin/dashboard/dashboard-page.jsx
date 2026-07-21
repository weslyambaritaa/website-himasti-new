import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Link, usePage } from "@inertiajs/react";
import {
    CalendarDays,
    FileText,
    Images,
    LayoutGrid,
    Newspaper,
    Plus,
    Sparkles,
    Users,
} from "lucide-react";
import { route } from "ziggy-js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

function formatDate(value) {
    return value ? dateFormatter.format(new Date(value)) : "-";
}

export default function AdminDashboardPage() {
    const { auth, statistics, recentNews, upcomingEvents, featuredPrograms } = usePage().props;
    const statItems = [
        { label: "Berita Terbit", value: statistics.news_published, icon: Newspaper, note: `${statistics.news_draft} masih draft` },
        { label: "Kegiatan Aktif", value: statistics.events_active, icon: CalendarDays, note: "Sedang atau akan berlangsung" },
        { label: "Program Kerja", value: statistics.work_programs, icon: FileText, note: "Sudah ditampilkan ke publik" },
        { label: "Dokumentasi", value: statistics.documentations, icon: Images, note: "Arsip kegiatan tersimpan" },
        { label: "Divisi Aktif", value: statistics.divisions, icon: LayoutGrid, note: `${statistics.members} anggota aktif` },
    ];

    return (
        <AppLayout>
            <div className="space-y-6">
                <section className="overflow-hidden rounded-2xl bg-[#1C2032] p-6 text-white shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Ringkasan Pengelolaan</p>
                            <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                                Selamat datang, {auth?.name ?? auth?.username ?? "Admin"}
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
                                Pantau konten yang sudah terbit, agenda terdekat, dan pekerjaan yang masih perlu dilengkapi dari satu halaman.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="bg-white text-[#1C2032] hover:bg-white/90">
                                <Link href={route("admin.news.create")}><Plus className="mr-2 size-4" /> Tambah Berita</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                                <Link href={route("public.home")} target="_blank">Lihat Website</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {statItems.map((item) => (
                        <Card key={item.label} className="border-slate-200 shadow-none">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{item.label}</p>
                                        <p className="mt-2 text-3xl font-semibold text-[#1C2032]">{item.value}</p>
                                    </div>
                                    <div className="rounded-xl bg-[#1C2032]/8 p-2.5 text-[#1C2032]">
                                        <item.icon className="size-5" />
                                    </div>
                                </div>
                                <p className="mt-4 text-xs leading-5 text-muted-foreground">{item.note}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border-slate-200 shadow-none">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-lg text-[#1C2032]">Berita Terbaru</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">Konten yang terakhir diperbarui.</p>
                            </div>
                            <Button asChild variant="outline" size="sm"><Link href={route("admin.news.index")}>Kelola</Link></Button>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y rounded-xl border">
                                {recentNews.length ? recentNews.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-[#1C2032]">{item.title}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">Diperbarui {formatDate(item.updated_at)}</p>
                                        </div>
                                        <Badge variant="outline" className="capitalize">{item.status}</Badge>
                                    </div>
                                )) : <p className="p-6 text-sm text-muted-foreground">Belum ada berita.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg text-[#1C2032]">Agenda Terdekat</CardTitle>
                            <p className="text-sm text-muted-foreground">Kegiatan publik yang belum selesai.</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {upcomingEvents.length ? upcomingEvents.map((item) => (
                                    <div key={item.id} className="rounded-xl border p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-medium text-[#1C2032]">{item.title}</p>
                                            {item.is_featured ? <Sparkles className="size-4 shrink-0 text-amber-500" /> : null}
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {formatDate(item.start_date)}{item.location ? ` · ${item.location}` : ""}
                                        </p>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">Belum ada kegiatan mendatang.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="border-slate-200 shadow-none">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg text-[#1C2032]">Program Unggulan</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">Program kerja yang diprioritaskan untuk tampil di beranda.</p>
                        </div>
                        <Button asChild variant="outline" size="sm"><Link href={route("admin.work-programs.index")}>Kelola Program</Link></Button>
                    </CardHeader>
                    <CardContent>
                        {featuredPrograms.length ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {featuredPrograms.map((item) => (
                                    <div key={item.id} className="rounded-xl border p-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
                                            <Sparkles className="size-4" /> Unggulan
                                        </div>
                                        <p className="mt-3 font-medium text-[#1C2032]">{item.name}</p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {[item.division?.name, item.year, item.status].filter(Boolean).join(" · ")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                                <Users className="size-5" /> Belum ada program kerja yang ditandai unggulan.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
