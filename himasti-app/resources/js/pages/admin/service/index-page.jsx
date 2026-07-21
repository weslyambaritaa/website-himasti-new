import DeleteConfirmationDialog from "@/components/admin/delete-confirmation-dialog";
import AdminEmptyState from "@/components/admin/empty-state";
import ExternalLink from "@/components/admin/external-link";
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

function truncate(value, length = 90) {
    if (!value) {
        return "-";
    }

    return value.length > length ? `${value.slice(0, length)}...` : value;
}

export default function ServiceIndexPage() {
    const { services, filters, sortableItems } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        is_active: filters?.is_active ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.service.index"), { preserveState: true, preserveScroll: true });
    };

    const hasFilter = Boolean(data.search || data.is_active !== "");

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Layanan"
                    description="Kelola layanan yang ditampilkan pada website publik beserta logo, tautan, dan status aktifnya."
                    action={
                        <Button asChild>
                            <Link href={route("admin.service.create")}>Tambah Layanan</Link>
                        </Button>
                    }
                />

                <AdminFilterBar
                    onReset={() => {
                        setData({ search: "", is_active: "" });
                        router.get(route("admin.service.index"));
                    }}
                >
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
                        <Input
                            aria-label="Cari layanan"
                            placeholder="Cari nama layanan"
                            value={data.search}
                            onChange={(event) => setData("search", event.target.value)}
                        />
                        <Select value={data.is_active || "all"} onValueChange={(value) => setData("is_active", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter status layanan">
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
                    title="Urutkan Layanan"
                    description="Drag dan drop layanan untuk mengatur urutan tampil pada website publik."
                    reorderUrl={route("admin.service.reorder")}
                    items={sortableItems.map((item) => ({
                        ...item,
                        image: item.logo,
                        imageAlt: item.name,
                        imageClassName: "h-14 rounded-md object-contain p-2",
                        subtitle: item.icon ? `Icon: ${item.icon}` : "Tanpa icon",
                        meta: item.url,
                        statusLabel: item.is_active ? "Aktif" : "Nonaktif",
                        statusTone: item.is_active ? "active" : "inactive",
                    }))}
                    emptyMessage="Belum ada layanan untuk diurutkan."
                />

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {services.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Logo / Icon</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Deskripsi Singkat</TableHead>
                                                <TableHead>URL</TableHead>
                                                <TableHead>Urutan</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {services.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div className="space-y-2">
                                                            <TableThumbnail
                                                                path={item.logo}
                                                                alt={item.name ? `Logo ${item.name}` : "Logo layanan"}
                                                                emptyLabel="Tanpa logo"
                                                                className="h-14 rounded-md object-contain p-2"
                                                            />
                                                            <p className="text-xs text-muted-foreground">Icon: {item.icon || "-"}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell className="max-w-xs text-sm text-muted-foreground">{truncate(item.description)}</TableCell>
                                                    <TableCell className="max-w-xs">
                                                        <ExternalLink href={item.url} />
                                                    </TableCell>
                                                    <TableCell>{item.order_number ?? 0}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge label={item.is_active ? "Aktif" : "Nonaktif"} tone={item.is_active ? "active" : "inactive"} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route("admin.service.edit", item.id)}>Edit</Link>
                                                            </Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus layanan ini?"
                                                                itemName={item.name}
                                                                description="Layanan akan dihapus. File logo terkait juga akan dibersihkan melalui mekanisme media yang sudah ada."
                                                                onConfirm={() => router.delete(route("admin.service.destroy", item.id))}
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
                                        Menampilkan {services.from} - {services.to} dari {services.total} data
                                    </p>
                                    <PaginationLinks paginator={services} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState
                                title={hasFilter ? "Tidak ada data yang cocok dengan filter" : "Belum ada layanan"}
                                description={hasFilter ? "Coba ubah atau reset filter pencarian." : "Tambahkan layanan pertama agar bisa ditampilkan di halaman publik."}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
