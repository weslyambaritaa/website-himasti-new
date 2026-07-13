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

export default function ServiceFormPage() {
    const { serviceItem } = usePage().props;
    const isEdit = !!serviceItem;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        name: serviceItem?.name ?? "",
        description: serviceItem?.description ?? "",
        icon: serviceItem?.icon ?? "",
        logo: null,
        url: serviceItem?.url ?? "",
        is_active: serviceItem?.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.service.update", serviceItem.id) : route("admin.service.store"));
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title={isEdit ? "Ubah Layanan" : "Tambah Layanan"}
                    description="Lengkapi informasi layanan, identitas visual, dan tautan yang akan dibuka pengunjung."
                />

                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Layanan" description="Nama dan deskripsi singkat akan ditampilkan pada halaman layanan publik.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Layanan</Label>
                                <Input id="name" value={data.name} onChange={(event) => setData("name", event.target.value)} />
                                {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Nama Icon</Label>
                                <Input id="icon" value={data.icon} onChange={(event) => setData("icon", event.target.value)} placeholder="Contoh: globe" />
                                <p className="text-xs text-muted-foreground">Disimpan sebagai teks aman, bukan HTML bebas.</p>
                                {errors.icon ? <p className="text-sm text-red-500">{errors.icon}</p> : null}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" rows={5} value={data.description} onChange={(event) => setData("description", event.target.value)} />
                            {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}
                        </div>
                    </FormSection>

                    <FormSection title="Identitas Visual" description="Logo lama tetap aman bila Anda menyimpan tanpa memilih file baru.">
                        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="logo">Logo Layanan</Label>
                                <Input id="logo" type="file" accept="image/*" onChange={(event) => setData("logo", event.target.files?.[0] ?? null)} />
                                <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                {errors.logo ? <p className="text-sm text-red-500">{errors.logo}</p> : null}
                            </div>
                            <MediaPreview file={data.logo} fallbackPath={serviceItem?.logo} alt={serviceItem?.name ? `Logo ${serviceItem.name}` : "Logo layanan"} emptyLabel="Belum ada logo layanan" className="h-40 rounded-lg object-contain p-4" />
                        </div>
                    </FormSection>

                    <FormSection title="Tautan dan Tampilan" description="Tentukan URL tujuan dan status aktif layanan.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="url">URL Tujuan</Label>
                                <Input id="url" type="url" value={data.url} onChange={(event) => setData("url", event.target.value)} />
                                {errors.url ? <p className="text-sm text-red-500">{errors.url}</p> : null}
                            </div>
                            <div className="rounded-lg border p-4 md:col-span-2">
                                <label className="flex items-center gap-3">
                                    <Checkbox checked={data.is_active} onCheckedChange={(value) => setData("is_active", !!value)} />
                                    <span>Aktifkan layanan untuk halaman publik</span>
                                </label>
                                {errors.is_active ? <p className="mt-2 text-sm text-red-500">{errors.is_active}</p> : null}
                            </div>
                        </div>
                    </FormSection>

                    <FormActions cancelHref={route("admin.service.index")} processing={processing} submitLabel="Simpan Layanan" processingLabel="Menyimpan Layanan..." />
                </form>
            </div>
        </AppLayout>
    );
}
