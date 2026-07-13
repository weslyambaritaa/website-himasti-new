import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function DivisionFormPage() {
    const { division } = usePage().props;
    const isEdit = !!division;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        name: division?.name ?? "",
        slug: division?.slug ?? "",
        short_name: division?.short_name ?? "",
        description: division?.description ?? "",
        logo: null,
        cover_image: null,
        is_active: division?.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.division.update", division.id) : route("admin.division.store"));
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title={isEdit ? "Ubah Divisi" : "Tambah Divisi"}
                    description="Lengkapi identitas divisi dan media pendukung untuk halaman publik."
                />

                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Divisi" description="Nama dan slug dipakai untuk identitas divisi serta URL halaman publik.">
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                ["name", "Nama Divisi"],
                                ["slug", "Slug"],
                                ["short_name", "Singkatan / Nama Singkat"],
                            ].map(([key, label]) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{label}</Label>
                                    <Input id={key} value={data[key]} onChange={(event) => setData(key, event.target.value)} />
                                    {errors[key] ? <p className="text-sm text-red-500">{errors[key]}</p> : null}
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi Divisi</Label>
                            <Textarea id="description" rows={6} value={data.description} onChange={(event) => setData("description", event.target.value)} />
                            {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}
                        </div>
                    </FormSection>

                    <FormSection title="Media Divisi" description="Logo dan cover akan tetap dipertahankan bila Anda menyimpan tanpa memilih file baru.">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="logo">Logo Divisi</Label>
                                    <Input id="logo" type="file" accept="image/*" onChange={(event) => setData("logo", event.target.files?.[0] ?? null)} />
                                    <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                    {errors.logo ? <p className="text-sm text-red-500">{errors.logo}</p> : null}
                                </div>
                                <MediaPreview file={data.logo} fallbackPath={division?.logo} alt={division?.name ? `Logo ${division.name}` : "Logo divisi"} emptyLabel="Belum ada logo divisi" className="h-40 rounded-lg object-contain p-4" />
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cover_image">Cover Divisi</Label>
                                    <Input id="cover_image" type="file" accept="image/*" onChange={(event) => setData("cover_image", event.target.files?.[0] ?? null)} />
                                    <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                    {errors.cover_image ? <p className="text-sm text-red-500">{errors.cover_image}</p> : null}
                                </div>
                                <MediaPreview file={data.cover_image} fallbackPath={division?.cover_image} alt={division?.name ? `Cover ${division.name}` : "Cover divisi"} emptyLabel="Belum ada cover divisi" />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Pengaturan Tampilan" description="Status aktif menentukan apakah divisi bisa tampil pada halaman publik.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border p-4">
                                <label className="flex items-center gap-3">
                                    <Checkbox checked={data.is_active} onCheckedChange={(value) => setData("is_active", !!value)} />
                                    <span>Aktifkan divisi untuk halaman publik</span>
                                </label>
                                {errors.is_active ? <p className="mt-2 text-sm text-red-500">{errors.is_active}</p> : null}
                            </div>
                        </div>
                    </FormSection>

                    <FormActions cancelHref={route("admin.division.index")} processing={processing} submitLabel="Simpan Divisi" processingLabel="Menyimpan Divisi..." />
                </form>
            </div>
        </AppLayout>
    );
}
