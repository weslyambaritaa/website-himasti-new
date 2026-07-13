import DeleteConfirmationDialog from "@/components/admin/delete-confirmation-dialog";
import AdminEmptyState from "@/components/admin/empty-state";
import AdminFilterBar from "@/components/admin/filter-bar";
import PaginationLinks from "@/components/admin/pagination-links";
import AdminPageHeader from "@/components/admin/page-header";
import TableThumbnail from "@/components/admin/table-thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function DocumentationIndexPage() {
    const { documentations, workPrograms, filters } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        year: filters?.year ?? "",
        work_program_id: filters?.work_program_id ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.documentation.index"), { preserveState: true, preserveScroll: true });
    };

    const hasFilter = Boolean(data.search || data.year || data.work_program_id);

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Dokumentasi"
                    description="Kelola dokumentasi kegiatan, cover, galeri foto, dan keterkaitannya dengan program kerja."
                    action={
                        <Button asChild>
                            <Link href={route("admin.documentation.create")}>Tambah Dokumentasi</Link>
                        </Button>
                    }
                />

                <AdminFilterBar
                    onReset={() => {
                        setData({ search: "", year: "", work_program_id: "" });
                        router.get(route("admin.documentation.index"));
                    }}
                >
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_180px_1fr_auto]">
                        <Input
                            aria-label="Cari dokumentasi"
                            placeholder="Cari judul atau lokasi"
                            value={data.search}
                            onChange={(event) => setData("search", event.target.value)}
                        />
                        <Input
                            aria-label="Filter tahun dokumentasi"
                            type="number"
                            placeholder="Tahun"
                            value={data.year}
                            onChange={(event) => setData("year", event.target.value)}
                        />
                        <Select value={data.work_program_id || "all"} onValueChange={(value) => setData("work_program_id", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter program kerja">
                                <SelectValue placeholder="Semua program kerja" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua program kerja</SelectItem>
                                {workPrograms.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.name}{item.division?.name ? ` - ${item.division.name}` : ""}{item.year ? ` (${item.year})` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={processing}>Cari</Button>
                    </form>
                </AdminFilterBar>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {documentations.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cover</TableHead>
                                                <TableHead>Judul</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Lokasi</TableHead>
                                                <TableHead>Program Kerja</TableHead>
                                                <TableHead>Jumlah Foto</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {documentations.data.map((item) => {
                                                const fallbackImage = item.cover_image || item.images?.[0]?.image || null;

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <TableThumbnail
                                                                path={fallbackImage}
                                                                alt={item.title ? `Cover ${item.title}` : "Cover dokumentasi"}
                                                                emptyLabel="Tanpa media"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">{item.title}</TableCell>
                                                        <TableCell>{item.event_date || "-"}</TableCell>
                                                        <TableCell>{item.location || "-"}</TableCell>
                                                        <TableCell>
                                                            {item.work_program ? (
                                                                <div className="space-y-1">
                                                                    <p className="font-medium">{item.work_program.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{item.work_program.division?.name || "Tanpa divisi"}</p>
                                                                </div>
                                                            ) : (
                                                                "-"
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{item.images_count ?? item.images?.length ?? 0}</TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="outline" size="sm" asChild>
                                                                    <Link href={route("admin.documentation.edit", item.id)}>Edit</Link>
                                                                </Button>
                                                                <DeleteConfirmationDialog
                                                                    title="Hapus dokumentasi ini?"
                                                                    itemName={item.title}
                                                                    description="Dokumentasi beserta cover dan seluruh file galeri terkait akan dihapus sesuai mekanisme media yang sudah ditentukan."
                                                                    onConfirm={() => router.delete(route("admin.documentation.destroy", item.id))}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Menampilkan {documentations.from} - {documentations.to} dari {documentations.total} data
                                    </p>
                                    <PaginationLinks paginator={documentations} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState
                                title={hasFilter ? "Tidak ada data yang cocok dengan filter" : "Belum ada dokumentasi"}
                                description={hasFilter ? "Coba ubah atau reset filter pencarian." : "Tambahkan dokumentasi pertama untuk mulai menampilkan galeri kegiatan."}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
