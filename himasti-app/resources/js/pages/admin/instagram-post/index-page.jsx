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

export default function InstagramPostIndexPage() {
    const { instagramPosts, filters, sortableItems } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? "",
        is_shown: filters?.is_shown ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        get(route("admin.instagram-post.index"), { preserveState: true, preserveScroll: true });
    };

    const hasFilter = Boolean(data.search || data.is_shown !== "");

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Postingan Instagram"
                    description="Kelola postingan Instagram manual yang akan ditampilkan pada landing page publik."
                    action={
                        <Button asChild>
                            <Link href={route("admin.instagram-post.create")}>Tambah Postingan Instagram</Link>
                        </Button>
                    }
                />

                <AdminFilterBar
                    onReset={() => {
                        setData({ search: "", is_shown: "" });
                        router.get(route("admin.instagram-post.index"));
                    }}
                >
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
                        <Input
                            aria-label="Cari postingan Instagram"
                            placeholder="Cari judul atau caption singkat"
                            value={data.search}
                            onChange={(event) => setData("search", event.target.value)}
                        />
                        <Select value={data.is_shown || "all"} onValueChange={(value) => setData("is_shown", value === "all" ? "" : value)}>
                            <SelectTrigger aria-label="Filter status tampil postingan Instagram">
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
                    title="Urutkan Postingan Instagram"
                    description="Drag dan drop postingan untuk mengatur urutan tampil pada landing page."
                    reorderUrl={route("admin.instagram-post.reorder")}
                    items={sortableItems.map((item) => ({
                        ...item,
                        title: item.title || "Postingan Instagram",
                        image: item.image,
                        imageAlt: item.title || "Postingan Instagram",
                        subtitle: item.published_at || "Belum ada tanggal posting",
                        statusLabel: item.is_shown ? "Ditampilkan" : "Disembunyikan",
                        statusTone: item.is_shown ? "shown" : "hidden",
                    }))}
                    emptyMessage="Belum ada postingan Instagram untuk diurutkan."
                />

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {instagramPosts.data.length ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Gambar</TableHead>
                                                <TableHead>Judul</TableHead>
                                                <TableHead>Tanggal Posting</TableHead>
                                                <TableHead>Urutan</TableHead>
                                                <TableHead>Status Tampil</TableHead>
                                                <TableHead>Link Instagram</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {instagramPosts.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <TableThumbnail
                                                            path={item.image}
                                                            alt={item.title ? `Thumbnail ${item.title}` : "Thumbnail postingan Instagram"}
                                                            emptyLabel="Tanpa gambar"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.title || "Postingan Instagram"}</TableCell>
                                                    <TableCell>{item.published_at || "-"}</TableCell>
                                                    <TableCell>{item.order_number ?? 0}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge label={item.is_shown ? "Ditampilkan" : "Disembunyikan"} tone={item.is_shown ? "shown" : "hidden"} />
                                                    </TableCell>
                                                    <TableCell className="max-w-xs">
                                                        <ExternalLink href={item.instagram_url} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route("admin.instagram-post.edit", item.id)}>Edit</Link>
                                                            </Button>
                                                            <DeleteConfirmationDialog
                                                                title="Hapus postingan Instagram ini?"
                                                                itemName={item.title || "Postingan Instagram"}
                                                                description="Data postingan akan dihapus, termasuk file gambar thumbnail terkait melalui mekanisme media yang sudah ada."
                                                                onConfirm={() => router.delete(route("admin.instagram-post.destroy", item.id))}
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
                                        Menampilkan {instagramPosts.from} - {instagramPosts.to} dari {instagramPosts.total} data
                                    </p>
                                    <PaginationLinks paginator={instagramPosts} />
                                </div>
                            </>
                        ) : (
                            <AdminEmptyState
                                title={hasFilter ? "Tidak ada data yang cocok dengan filter" : "Belum ada postingan Instagram"}
                                description={hasFilter ? "Coba ubah atau reset filter pencarian." : "Tambahkan postingan secara manual agar dapat ditampilkan di landing page."}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
