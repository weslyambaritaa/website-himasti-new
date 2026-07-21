import DeleteConfirmationDialog from "@/components/admin/delete-confirmation-dialog";
import AdminEmptyState from "@/components/admin/empty-state";
import AdminFilterBar from "@/components/admin/filter-bar";
import AdminPageHeader from "@/components/admin/page-header";
import PaginationLinks from "@/components/admin/pagination-links";
import SortableOrderPanel from "@/components/admin/sortable-order-panel";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function WorkProgramIndexPage() {
    const {
        workPrograms,
        filters,
        divisions,
        statuses,
        years = [],
        sortableItems,
    } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        division_id: filters?.division_id ?? "",
        year: filters?.year ?? "",
        status: filters?.status ?? "",
        is_published: filters?.is_published ?? "",
        is_featured: filters?.is_featured ?? "",
    });

    const submitFilter = (event) => {
        event.preventDefault();
        get(route("admin.work-programs.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Program Kerja"
                    description="Kelola program kerja tiap divisi, status pelaksanaan, visibilitas publik, dan urutan tampil."
                    action={
                        <Button asChild>
                            <Link href={route("admin.work-programs.create")}>
                                Tambah Program Kerja
                            </Link>
                        </Button>
                    }
                />

                <AdminFilterBar
                    onReset={() => {
                        setData({
                            search: "",
                            division_id: "",
                            year: "",
                            status: "",
                            is_published: "",
                            is_featured: "",
                        });
                        router.get(route("admin.work-programs.index"));
                    }}
                >
                    <form
                        onSubmit={submitFilter}
                        className="grid gap-3 md:grid-cols-2 xl:grid-cols-6"
                    >
                        <Input
                            placeholder="Cari nama program"
                            value={data.search}
                            onChange={(event) =>
                                setData("search", event.target.value)
                            }
                        />
                        <Select
                            value={data.division_id || "all"}
                            onValueChange={(value) =>
                                setData(
                                    "division_id",
                                    value === "all" ? "" : value,
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua divisi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua divisi
                                </SelectItem>
                                {divisions.map((division) => (
                                    <SelectItem
                                        key={division.id}
                                        value={division.id.toString()}
                                    >
                                        {division.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={data.year || "all"}
                            onValueChange={(value) =>
                                setData("year", value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua tahun</SelectItem>
                                {years.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={data.status || "all"}
                            onValueChange={(value) =>
                                setData("status", value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua status
                                </SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={data.is_published || "all"}
                            onValueChange={(value) =>
                                setData(
                                    "is_published",
                                    value === "all" ? "" : value,
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua visibilitas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua visibilitas
                                </SelectItem>
                                <SelectItem value="true">
                                    Ditampilkan
                                </SelectItem>
                                <SelectItem value="false">
                                    Disembunyikan
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={data.is_featured || "all"}
                            onValueChange={(value) =>
                                setData(
                                    "is_featured",
                                    value === "all" ? "" : value,
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua unggulan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua unggulan
                                </SelectItem>
                                <SelectItem value="true">Unggulan</SelectItem>
                                <SelectItem value="false">Biasa</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="xl:col-span-6">
                            <Button type="submit" disabled={processing}>
                                Cari
                            </Button>
                        </div>
                    </form>
                </AdminFilterBar>

                <SortableOrderPanel
                    title="Urutkan Program Kerja"
                    description="Drag dan drop program kerja untuk mengatur urutan tampil pada halaman publik."
                    reorderUrl={route("admin.work-programs.reorder")}
                    items={sortableItems.map((item) => ({
                        ...item,
                        image: item.cover_image,
                        imageAlt: item.name,
                        subtitle: [item.division?.name, item.year]
                            .filter(Boolean)
                            .join(" · "),
                        meta: item.slug,
                        statusLabel: item.is_published
                            ? "Ditampilkan"
                            : "Disembunyikan",
                        statusTone: item.is_published ? "published" : "draft",
                    }))}
                    emptyMessage="Belum ada program kerja untuk diurutkan."
                />

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {workPrograms.data.length ? (
                            <>
                                <div className="overflow-hidden rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Program</TableHead>
                                                <TableHead>Divisi</TableHead>
                                                <TableHead>Tahun</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Publik</TableHead>
                                                <TableHead>Urutan</TableHead>
                                                <TableHead className="text-right">
                                                    Aksi
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {workPrograms.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {item.slug}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.division?.name ??
                                                            "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.year}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge
                                                            label={item.status}
                                                            tone={item.status}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge
                                                            label={
                                                                item.is_published
                                                                    ? "Ditampilkan"
                                                                    : "Disembunyikan"
                                                            }
                                                            tone={
                                                                item.is_published
                                                                    ? "published"
                                                                    : "draft"
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.order_number}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "admin.work-programs.edit",
                                                                        item.id,
                                                                    )}
                                                                >
                                                                    Ubah
                                                                </Link>
                                                            </Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus program kerja ini?"
                                                                itemName={
                                                                    item.name
                                                                }
                                                                description="Program kerja akan dipindahkan ke data terhapus dan dokumentasi terkait tetap mengikuti mekanisme relasi yang sudah ada."
                                                                onConfirm={() =>
                                                                    router.delete(
                                                                        route(
                                                                            "admin.work-programs.destroy",
                                                                            item.id,
                                                                        ),
                                                                    )
                                                                }
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
                                        Menampilkan {workPrograms.from} -{" "}
                                        {workPrograms.to} dari{" "}
                                        {workPrograms.total} data.
                                    </p>
                                    <PaginationLinks paginator={workPrograms} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState
                                title="Belum ada program kerja"
                                description="Tambahkan program kerja baru atau ubah filter untuk melihat data lain."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
