import DeleteConfirmationDialog from "@/components/admin/delete-confirmation-dialog";
import AdminEmptyState from "@/components/admin/empty-state";
import AdminFilterBar from "@/components/admin/filter-bar";
import PaginationLinks from "@/components/admin/pagination-links";
import AdminPageHeader from "@/components/admin/page-header";
import SortableOrderPanel from "@/components/admin/sortable-order-panel";
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

export default function BannerIndexPage() {
    const { banners, filters, sortableItems } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        is_shown: filters?.is_shown ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.banner.index"), { preserveState: true, preserveScroll: true });
    };

    const reset = () => {
        setData({ search: "", is_shown: "" });
        router.get(route("admin.banner.index"));
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Banner"
                    description="Kelola banner utama yang tampil pada landing page publik."
                    action={
                        <Button asChild>
                            <Link href={route("admin.banner.create")}>Tambah Banner</Link>
                        </Button>
                    }
                />

                <AdminFilterBar onReset={reset}>
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
                        <Input
                            aria-label="Cari judul banner"
                            placeholder="Cari judul banner"
                            value={data.search}
                            onChange={(event) => setData("search", event.target.value)}
                        />
                        <Select value={data.is_shown || "all"} onValueChange={(value) => setData("is_shown", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter banner tampil">
                                <SelectValue placeholder="Semua status tampil" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua status tampil</SelectItem>
                                <SelectItem value="true">Ditampilkan</SelectItem>
                                <SelectItem value="false">Disembunyikan</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={processing}>Cari</Button>
                    </form>
                </AdminFilterBar>

                <SortableOrderPanel
                    title="Urutkan Banner"
                    description="Drag dan drop banner untuk mengatur urutan tampil. Banner paling atas akan tampil lebih dulu."
                    reorderUrl={route("admin.banner.reorder")}
                    items={sortableItems.map((item) => ({
                        ...item,
                        image: item.image,
                        imageAlt: item.title,
                        subtitle: item.subtitle || "Tanpa subtitle",
                        statusLabel: item.is_shown ? "Ditampilkan" : "Disembunyikan",
                        statusTone: item.is_shown ? "shown" : "hidden",
                    }))}
                    emptyMessage="Belum ada banner untuk diurutkan."
                />

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {banners.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Thumbnail</TableHead>
                                                <TableHead>Judul</TableHead>
                                                <TableHead>Urutan</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {banners.data.map((banner) => (
                                                <TableRow key={banner.id}>
                                                    <TableCell><TableThumbnail path={banner.image} alt={banner.title} emptyLabel="Tanpa banner" /></TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{banner.title}</p>
                                                            <p className="text-xs text-muted-foreground">{banner.subtitle || "Tanpa subtitle"}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{banner.order_number}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge label={banner.is_shown ? "Ditampilkan" : "Disembunyikan"} tone={banner.is_shown ? "shown" : "hidden"} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route("admin.banner.edit", banner.id)}>Edit</Link>
                                                            </Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus banner ini?"
                                                                itemName={banner.title}
                                                                description="Banner akan dipindahkan ke data terhapus dan tidak lagi tampil di landing page publik."
                                                                onConfirm={() => router.delete(route("admin.banner.destroy", banner.id))}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Menampilkan {banners.from} - {banners.to} dari {banners.total} data
                                    </p>
                                    <PaginationLinks paginator={banners} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState title="Belum ada banner" description="Tambahkan banner baru atau ubah filter pencarian." />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
