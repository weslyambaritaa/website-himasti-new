import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { route } from "ziggy-js";

export default function DocumentationFormPage() {
    const { documentation, workPrograms } = usePage().props;
    const isEdit = !!documentation;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        work_program_id: documentation?.work_program_id?.toString() ?? "",
        title: documentation?.title ?? "",
        slug: documentation?.slug ?? "",
        description: documentation?.description ?? "",
        event_date: documentation?.event_date ?? "",
        location: documentation?.location ?? "",
        cover_image: null,
        images: [],
        captions: [],
        existing_image_ids: documentation?.images?.map((image) => image.id) ?? [],
        existing_captions: documentation?.images?.reduce((acc, image) => {
            acc[image.id] = image.caption ?? "";
            return acc;
        }, {}) ?? {},
        existing_orders: documentation?.images?.reduce((acc, image, index) => {
            acc[image.id] = image.order_number ?? index;
            return acc;
        }, {}) ?? {},
    });

    useEffect(() => {
        if (data.images.length && data.captions.length !== data.images.length) {
            setData("captions", data.images.map((_, index) => data.captions[index] ?? ""));
        }
    }, [data.images]);

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.documentation.update", documentation.id) : route("admin.documentation.store"));
    };

    const toggleExistingImage = (id) => {
        setData(
            "existing_image_ids",
            data.existing_image_ids.includes(id)
                ? data.existing_image_ids.filter((itemId) => itemId !== id)
                : [...data.existing_image_ids, id]
        );
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader title={isEdit ? "Ubah Dokumentasi" : "Tambah Dokumentasi"} description="Kelola dokumentasi kegiatan, relasi program kerja, cover, dan galeri multi-image." />
                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Dokumentasi">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Program Kerja</Label>
                                <Select value={data.work_program_id || "none"} onValueChange={(value) => setData("work_program_id", value === "none" ? "" : value)}>
                                    <SelectTrigger><SelectValue placeholder="Opsional" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Tanpa Program Kerja</SelectItem>
                                        {workPrograms.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}{item.division?.name ? ` - ${item.division.name}` : ""}{item.year ? ` (${item.year})` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {["title", "slug", "location"].map((key) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{key === "title" ? "Judul" : key === "slug" ? "Slug" : "Lokasi"}</Label>
                                    <Input id={key} value={data[key]} onChange={(event) => setData(key, event.target.value)} />
                                    {errors[key] ? <p className="text-sm text-red-500">{errors[key]}</p> : null}
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
                            <div className="grid gap-2">
                                <Label htmlFor="event_date">Tanggal Kegiatan</Label>
                                <Input id="event_date" type="date" value={data.event_date} onChange={(event) => setData("event_date", event.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea id="description" rows={6} value={data.description} onChange={(event) => setData("description", event.target.value)} />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Cover Dokumentasi">
                        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="cover_image">Cover</Label>
                                <Input id="cover_image" type="file" accept="image/*" onChange={(event) => setData("cover_image", event.target.files?.[0] ?? null)} />
                                <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                {errors.cover_image ? <p className="text-sm text-red-500">{errors.cover_image}</p> : null}
                            </div>
                            <MediaPreview file={data.cover_image} fallbackPath={documentation?.cover_image} alt={documentation?.title ?? "Cover dokumentasi"} emptyLabel="Belum ada cover dokumentasi" />
                        </div>
                    </FormSection>

                    <FormSection title="Galeri Dokumentasi" description="Gambar lama baru akan dihapus setelah form berhasil disimpan.">
                        {documentation?.images?.length ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {documentation.images.map((image, index) => {
                                    const kept = data.existing_image_ids.includes(image.id);

                                    return (
                                        <div key={image.id} className="space-y-3 rounded-xl border p-4">
                                            <MediaPreview fallbackPath={image.image} alt={image.caption || `Gambar dokumentasi ${index + 1}`} emptyLabel="Tanpa gambar" />
                                            <div className="grid gap-2">
                                                <Label htmlFor={`existing_caption_${image.id}`}>Caption</Label>
                                                <Input
                                                    id={`existing_caption_${image.id}`}
                                                    value={data.existing_captions[image.id] ?? ""}
                                                    onChange={(event) => setData("existing_captions", { ...data.existing_captions, [image.id]: event.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`existing_order_${image.id}`}>Urutan</Label>
                                                <Input
                                                    id={`existing_order_${image.id}`}
                                                    type="number"
                                                    value={data.existing_orders[image.id] ?? index}
                                                    onChange={(event) => setData("existing_orders", { ...data.existing_orders, [image.id]: event.target.value })}
                                                />
                                            </div>
                                            <label className="flex items-center gap-3 rounded-lg border p-3">
                                                <input type="checkbox" checked={!kept} onChange={() => toggleExistingImage(image.id)} aria-label={`Tandai hapus ${image.caption || image.image}`} />
                                                <span>{kept ? "Pertahankan gambar ini" : "Gambar akan dihapus saat disimpan"}</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Belum ada gambar lama pada dokumentasi ini.</p>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="images">Tambah Gambar Baru</Label>
                            <Input id="images" type="file" accept="image/*" multiple onChange={(event) => setData("images", Array.from(event.target.files || []))} />
                        </div>

                        {data.images.length ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {data.images.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="space-y-3 rounded-xl border p-4">
                                        <MediaPreview file={file} alt={file.name} emptyLabel="Preview gambar baru" />
                                        <p className="text-sm text-muted-foreground">{file.name}</p>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`caption_${index}`}>Caption</Label>
                                            <Input
                                                id={`caption_${index}`}
                                                value={data.captions[index] ?? ""}
                                                onChange={(event) => {
                                                    const nextCaptions = [...data.captions];
                                                    nextCaptions[index] = event.target.value;
                                                    setData("captions", nextCaptions);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </FormSection>

                    <FormActions cancelHref={route("admin.documentation.index")} processing={processing} submitLabel="Simpan Dokumentasi" processingLabel="Menyimpan Dokumentasi..." />
                </form>
            </div>
        </AppLayout>
    );
}
