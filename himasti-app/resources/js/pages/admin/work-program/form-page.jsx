import MediaPreview from "@/components/media-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function WorkProgramFormPage() {
    const { workProgram, divisions, statuses } = usePage().props;
    const isEdit = !!workProgram;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        division_id: workProgram?.division_id?.toString() ?? "",
        name: workProgram?.name ?? "",
        slug: workProgram?.slug ?? "",
        cover_image: null,
        description: workProgram?.description ?? "",
        status: workProgram?.status ?? "planned",
        year: workProgram?.year?.toString() ?? "",
        start_date: workProgram?.start_date ?? "",
        end_date: workProgram?.end_date ?? "",
        is_featured: workProgram?.is_featured ?? false,
        is_published: workProgram?.is_published ?? false,
    });

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.work-programs.update", workProgram.id) : route("admin.work-programs.store"));
    };

    return (
        <AppLayout>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{isEdit ? "Ubah Program Kerja" : "Tambah Program Kerja"}</CardTitle>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.work-programs.index")}>Kembali</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-6">
                                <div className="grid gap-2">
                                    <Label>Divisi</Label>
                                    <Select value={data.division_id} onValueChange={(value) => setData("division_id", value)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih divisi" /></SelectTrigger>
                                        <SelectContent>
                                            {divisions.map((division) => (
                                                <SelectItem key={division.id} value={division.id.toString()}>{division.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.division_id ? <p className="text-sm text-red-500">{errors.division_id}</p> : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Program</Label>
                                        <Input id="name" value={data.name} onChange={(event) => setData("name", event.target.value)} />
                                        {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input id="slug" value={data.slug} onChange={(event) => setData("slug", event.target.value)} placeholder="Kosongkan untuk otomatis" />
                                        {errors.slug ? <p className="text-sm text-red-500">{errors.slug}</p> : null}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea id="description" rows={8} value={data.description} onChange={(event) => setData("description", event.target.value)} />
                                    {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start_date">Tanggal Mulai</Label>
                                        <Input id="start_date" type="date" value={data.start_date} onChange={(event) => setData("start_date", event.target.value)} />
                                        {errors.start_date ? <p className="text-sm text-red-500">{errors.start_date}</p> : null}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end_date">Tanggal Selesai</Label>
                                        <Input id="end_date" type="date" value={data.end_date} onChange={(event) => setData("end_date", event.target.value)} />
                                        {errors.end_date ? <p className="text-sm text-red-500">{errors.end_date}</p> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="cover_image">Cover Program</Label>
                                    <Input id="cover_image" type="file" accept="image/*" onChange={(event) => setData("cover_image", event.target.files?.[0] ?? null)} />
                                    <MediaPreview file={data.cover_image} fallbackPath={workProgram?.cover_image} alt={workProgram?.name ?? "Preview cover program"} />
                                    {errors.cover_image ? <p className="text-sm text-red-500">{errors.cover_image}</p> : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="year">Tahun</Label>
                                        <Input id="year" type="number" value={data.year} onChange={(event) => setData("year", event.target.value)} />
                                        {errors.year ? <p className="text-sm text-red-500">{errors.year}</p> : null}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status ? <p className="text-sm text-red-500">{errors.status}</p> : null}
                                </div>

                                <div className="space-y-3 rounded-lg border p-4">
                                    <label className="flex items-center gap-3">
                                        <Checkbox checked={data.is_published} onCheckedChange={(value) => setData("is_published", !!value)} />
                                        <span>Tampilkan di publik</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <Checkbox checked={data.is_featured} onCheckedChange={(value) => setData("is_featured", !!value)} />
                                        <span>Tandai sebagai unggulan</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={processing}>{processing ? "Menyimpan..." : "Simpan"}</Button>
                            <Button variant="outline" asChild>
                                <Link href={route("admin.work-programs.index")}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
