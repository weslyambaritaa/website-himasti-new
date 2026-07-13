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

export default function DivisionIndexPage() {
    const { divisions, filters, sortableItems } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        is_active: filters?.is_active ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.division.index"), { preserveState: true, preserveScroll: true });
    };

    const hasFilter = Boolean(data.search || data.is_active !== "");

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Divisi"
                    description="Kelola identitas divisi, urutan tampil, dan status aktif untuk halaman publik."
                    action={
                        <Button asChild>
                            <Link href={route("admin.division.create")}>Tambah Divisi</Link>
                        </Button>
                    }
                />

                <AdminFilterBar
                    onReset={() => {
                        setData({ search: "", is_active: "" });
                        router.get(route("admin.division.index"));
                    }}
                >
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
                        <Input
                            aria-label="Cari divisi"
                            placeholder="Cari nama divisi"
                            value={data.search}
                            onChange={(event) => setData("search", event.target.value)}
                        />
                        <Select value={data.is_active || "all"} onValueChange={(value) => setData("is_active", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter status divisi">
                                <SelectValue placeholder="Semua status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua status</SelectItem>
                                <SelectItem value="true">Aktif</SelectItem>
                                <SelectItem value="false">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={processing}>Cari</Button>
                    </form>
                </AdminFilterBar>

                <SortableOrderPanel
                    title="Urutkan Divisi"
                    description="Drag dan drop divisi untuk mengatur urutan tampil pada halaman publik."
                    reorderUrl={route("admin.division.reorder")}
                    items={sortableItems.map((item) => ({
                        ...item,
                        image: item.logo,
                        imageAlt: item.name,
                        imageClassName: "h-14 rounded-md object-contain p-2",
                        subtitle: item.short_name || item.slug,
                        statusLabel: item.is_active ? "Aktif" : "Nonaktif",
                        statusTone: item.is_active ? "active" : "inactive",
                    }))}
                    emptyMessage="Belum ada divisi untuk diurutkan."
                />

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {divisions.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Urutan</TableHead>
                                                <TableHead>Logo</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Singkatan</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Jumlah Anggota</TableHead>
                                                <TableHead>Jumlah Program Kerja</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {divisions.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.order_number ?? 0}</TableCell>
                                                    <TableCell>
                                                        <TableThumbnail
                                                            path={item.logo}
                                                            alt={item.name ? `Logo ${item.name}` : "Logo divisi"}
                                                            emptyLabel="Tanpa logo"
                                                            className="h-14 rounded-md object-contain p-2"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-xs text-muted-foreground">{item.slug}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{item.short_name || "-"}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge label={item.is_active ? "Aktif" : "Nonaktif"} tone={item.is_active ? "active" : "inactive"} />
                                                    </TableCell>
                                                    <TableCell>{item.members_count ?? 0}</TableCell>
                                                    <TableCell>{item.work_programs_count ?? 0}</TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route("admin.division.edit", item.id)}>Edit</Link>
                                                            </Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus divisi ini?"
                                                                itemName={item.name}
                                                                description="Divisi akan dipindahkan ke data terhapus. File logo dan cover terkait juga akan dihapus melalui mekanisme media yang sudah ada."
                                                                onConfirm={() => router.delete(route("admin.division.destroy", item.id))}
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
                                        Menampilkan {divisions.from} - {divisions.to} dari {divisions.total} data
                                    </p>
                                    <PaginationLinks paginator={divisions} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState
                                title={hasFilter ? "Tidak ada data yang cocok dengan filter" : "Belum ada divisi"}
                                description={hasFilter ? "Coba ubah atau reset filter pencarian." : "Tambahkan divisi pertama untuk mulai menyusun struktur organisasi."}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
