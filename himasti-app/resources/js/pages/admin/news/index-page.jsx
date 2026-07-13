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

export default function NewsIndexPage() {
    const { newsItems, filters } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        status: filters?.status ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.news.index"), { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Berita"
                    description="Kelola berita yang tampil di website publik beserta status publikasinya."
                    action={
                        <Button asChild>
                            <Link href={route("admin.news.create")}>Tambah Berita</Link>
                        </Button>
                    }
                />
                <AdminFilterBar onReset={() => router.get(route("admin.news.index"))}>
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
                        <Input placeholder="Cari judul berita" value={data.search} onChange={(event) => setData("search", event.target.value)} />
                        <Select value={data.status || "all"} onValueChange={(value) => setData("status", value === "all" ? "" : value)}>
                            <SelectTrigger><SelectValue placeholder="Semua status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua status</SelectItem>
                                <SelectItem value="draft">Draf</SelectItem>
                                <SelectItem value="published">Dipublikasikan</SelectItem>
                                <SelectItem value="archived">Diarsipkan</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={processing}>Cari</Button>
                    </form>
                </AdminFilterBar>
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {newsItems.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cover</TableHead>
                                                <TableHead>Judul</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Publikasi</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {newsItems.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell><TableThumbnail path={item.cover_image} alt={item.title} emptyLabel="Tanpa cover" /></TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{item.title}</p>
                                                            <p className="text-xs text-muted-foreground">{item.excerpt || "Tanpa ringkasan"}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><StatusBadge label={item.status === "draft" ? "Draf" : item.status === "published" ? "Dipublikasikan" : "Diarsipkan"} tone={item.status} /></TableCell>
                                                    <TableCell>{item.published_at || "-"}</TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route("admin.news.edit", item.id)}>Edit</Link>
                                                            </Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus berita ini?"
                                                                itemName={item.title}
                                                                description="Berita akan dipindahkan ke data terhapus dan tidak lagi tampil di website publik."
                                                                onConfirm={() => router.delete(route("admin.news.destroy", item.id))}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <p className="text-sm text-muted-foreground">Menampilkan {newsItems.from} - {newsItems.to} dari {newsItems.total} data</p>
                                    <PaginationLinks paginator={newsItems} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState title="Belum ada berita" description="Tambahkan berita baru atau ubah filter pencarian." />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
