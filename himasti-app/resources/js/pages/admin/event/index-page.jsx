import DeleteConfirmationDialog from "@/components/admin/delete-confirmation-dialog";
import AdminEmptyState from "@/components/admin/empty-state";
import AdminFilterBar from "@/components/admin/filter-bar";
import PaginationLinks from "@/components/admin/pagination-links";
import AdminPageHeader from "@/components/admin/page-header";
import TableThumbnail from "@/components/admin/table-thumbnail";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function EventIndexPage() {
    const { events, filters } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        location: filters?.location ?? "",
        status: filters?.status ?? "",
        is_published: filters?.is_published ?? "",
        is_featured: filters?.is_featured ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.event.index"), { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Kegiatan"
                    description="Kelola kegiatan yang dipublikasikan, unggulan, dan jadwal tampil di website."
                    action={<Button asChild><Link href={route("admin.event.create")}>Tambah Kegiatan</Link></Button>}
                />
                <AdminFilterBar onReset={() => router.get(route("admin.event.index"))}>
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-5">
                        <Input placeholder="Cari judul" value={data.search} onChange={(event) => setData("search", event.target.value)} />
                        <Input placeholder="Cari lokasi" value={data.location} onChange={(event) => setData("location", event.target.value)} />
                        <Select value={data.status || "all"} onValueChange={(value) => setData("status", value === "all" ? "" : value)}>
                            <SelectTrigger><SelectValue placeholder="Semua status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua status</SelectItem>
                                <SelectItem value="upcoming">Akan Datang</SelectItem>
                                <SelectItem value="ongoing">Berlangsung</SelectItem>
                                <SelectItem value="completed">Selesai</SelectItem>
                                <SelectItem value="cancelled">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={data.is_published || "all"} onValueChange={(value) => setData("is_published", value === "all" ? "" : value)}>
                            <SelectTrigger><SelectValue placeholder="Semua publikasi" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua publikasi</SelectItem>
                                <SelectItem value="true">Dipublikasikan</SelectItem>
                                <SelectItem value="false">Disembunyikan</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={data.is_featured || "all"} onValueChange={(value) => setData("is_featured", value === "all" ? "" : value)}>
                            <SelectTrigger><SelectValue placeholder="Semua unggulan" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua unggulan</SelectItem>
                                <SelectItem value="true">Unggulan</SelectItem>
                                <SelectItem value="false">Biasa</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="md:col-span-5">
                            <Button type="submit" disabled={processing}>Cari</Button>
                        </div>
                    </form>
                </AdminFilterBar>
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {events.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cover</TableHead>
                                                <TableHead>Kegiatan</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Publik</TableHead>
                                                <TableHead>Unggulan</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {events.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell><TableThumbnail path={item.cover_image} alt={item.title} emptyLabel="Tanpa cover" /></TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{item.title}</p>
                                                            <p className="text-xs text-muted-foreground">{item.location || "Lokasi belum diisi"}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><StatusBadge label={item.status} tone={item.status} /></TableCell>
                                                    <TableCell><StatusBadge label={item.is_published ? "Dipublikasikan" : "Disembunyikan"} tone={item.is_published ? "published" : "draft"} /></TableCell>
                                                    <TableCell><StatusBadge label={item.is_featured ? "Unggulan" : "Biasa"} tone={item.is_featured ? "ongoing" : "inactive"} /></TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild><Link href={route("admin.event.edit", item.id)}>Edit</Link></Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus kegiatan ini?"
                                                                itemName={item.title}
                                                                description="Kegiatan akan dipindahkan ke data terhapus dan tidak lagi tampil di website publik."
                                                                onConfirm={() => router.delete(route("admin.event.destroy", item.id))}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <p className="text-sm text-muted-foreground">Menampilkan {events.from} - {events.to} dari {events.total} data</p>
                                    <PaginationLinks paginator={events} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState title="Belum ada kegiatan" description="Tambahkan kegiatan baru atau ubah filter pencarian." />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
