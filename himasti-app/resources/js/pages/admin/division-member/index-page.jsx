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

export default function DivisionMemberIndexPage() {
    const { divisionMembers, divisions, periods, filters, sortableItems } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        division_id: filters?.division_id ?? "",
        period: filters?.period ?? "",
        is_active: filters?.is_active ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.division-member.index"), { preserveState: true, preserveScroll: true });
    };

    const hasFilter = Boolean(data.search || data.division_id || data.period || data.is_active !== "");

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Anggota Divisi"
                    description="Kelola pengurus tiap divisi, periode kepengurusan, foto, dan urutan tampil."
                    action={
                        <Button asChild>
                            <Link href={route("admin.division-member.create")}>Tambah Anggota Divisi</Link>
                        </Button>
                    }
                />

                <AdminFilterBar
                    onReset={() => {
                        setData({ search: "", division_id: "", period: "", is_active: "" });
                        router.get(route("admin.division-member.index"));
                    }}
                >
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
                        <Input
                            aria-label="Cari anggota divisi"
                            placeholder="Cari nama atau jabatan"
                            value={data.search}
                            onChange={(event) => setData("search", event.target.value)}
                        />
                        <Select value={data.division_id || "all"} onValueChange={(value) => setData("division_id", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter divisi">
                                <SelectValue placeholder="Semua divisi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua divisi</SelectItem>
                                {divisions.map((division) => (
                                    <SelectItem key={division.id} value={division.id.toString()}>{division.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={data.period || "all"} onValueChange={(value) => setData("period", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter periode">
                                <SelectValue placeholder="Semua periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua periode</SelectItem>
                                {periods.map((period) => (
                                    <SelectItem key={period} value={period}>{period}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={data.is_active || "all"} onValueChange={(value) => setData("is_active", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter status anggota divisi">
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
                    title="Urutkan Anggota Divisi"
                    description="Drag dan drop anggota divisi untuk mengatur urutan tampil pada halaman publik."
                    reorderUrl={route("admin.division-member.reorder")}
                    items={sortableItems.map((item) => ({
                        ...item,
                        image: item.photo,
                        imageAlt: item.name,
                        subtitle: [item.position, item.division?.name].filter(Boolean).join(" · "),
                        meta: item.period || null,
                        statusLabel: item.is_active ? "Aktif" : "Nonaktif",
                        statusTone: item.is_active ? "active" : "inactive",
                    }))}
                    emptyMessage="Belum ada anggota divisi untuk diurutkan."
                />

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {divisionMembers.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Foto</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Jabatan</TableHead>
                                                <TableHead>Divisi</TableHead>
                                                <TableHead>Periode</TableHead>
                                                <TableHead>Urutan</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {divisionMembers.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <TableThumbnail
                                                            path={item.photo}
                                                            alt={item.name ? `Foto ${item.name}` : "Foto anggota divisi"}
                                                            emptyLabel="Tanpa foto"
                                                            className="h-14 rounded-md object-cover"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>{item.position}</TableCell>
                                                    <TableCell>{item.division?.name ?? "-"}</TableCell>
                                                    <TableCell>{item.period || "-"}</TableCell>
                                                    <TableCell>{item.order_number ?? 0}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge label={item.is_active ? "Aktif" : "Nonaktif"} tone={item.is_active ? "active" : "inactive"} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route("admin.division-member.edit", item.id)}>Edit</Link>
                                                            </Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus anggota divisi ini?"
                                                                itemName={item.name}
                                                                description="Data anggota divisi akan dihapus, termasuk file foto terkait melalui mekanisme media yang sudah ada."
                                                                onConfirm={() => router.delete(route("admin.division-member.destroy", item.id))}
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
                                        Menampilkan {divisionMembers.from} - {divisionMembers.to} dari {divisionMembers.total} data
                                    </p>
                                    <PaginationLinks paginator={divisionMembers} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState
                                title={hasFilter ? "Tidak ada data yang cocok dengan filter" : "Belum ada anggota divisi"}
                                description={hasFilter ? "Coba ubah atau reset filter pencarian." : "Tambahkan anggota divisi pertama untuk mulai menampilkan struktur kepengurusan."}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
