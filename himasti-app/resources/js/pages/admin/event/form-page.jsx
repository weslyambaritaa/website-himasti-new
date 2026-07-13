import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function EventFormPage() {
    const { eventItem } = usePage().props;
    const isEdit = !!eventItem;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        title: eventItem?.title ?? "",
        slug: eventItem?.slug ?? "",
        cover_image: null,
        description: eventItem?.description ?? "",
        location: eventItem?.location ?? "",
        start_date: eventItem?.start_date ?? "",
        end_date: eventItem?.end_date ?? "",
        registration_url: eventItem?.registration_url ?? "",
        status: eventItem?.status ?? "upcoming",
        is_published: eventItem?.is_published ?? false,
        is_featured: eventItem?.is_featured ?? false,
    });

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.event.update", eventItem.id) : route("admin.event.store"));
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader title={isEdit ? "Ubah Kegiatan" : "Tambah Kegiatan"} description="Kelola agenda kegiatan, visibilitas publik, dan status unggulan." />
                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Kegiatan">
                        <div className="grid gap-4 md:grid-cols-2">
                            {["title", "slug", "location", "registration_url"].map((key) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{key === "title" ? "Judul" : key === "slug" ? "Slug" : key === "location" ? "Lokasi" : "URL Pendaftaran"}</Label>
                                    <Input id={key} type={key === "registration_url" ? "url" : "text"} value={data[key]} onChange={(event) => setData(key, event.target.value)} />
                                    {errors[key] ? <p className="text-sm text-red-500">{errors[key]}</p> : null}
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" rows={7} value={data.description} onChange={(event) => setData("description", event.target.value)} />
                            {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}
                        </div>
                    </FormSection>
                    <FormSection title="Media">
                        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="cover_image">Cover Kegiatan</Label>
                                <Input id="cover_image" type="file" accept="image/*" onChange={(event) => setData("cover_image", event.target.files?.[0] ?? null)} />
                                {errors.cover_image ? <p className="text-sm text-red-500">{errors.cover_image}</p> : null}
                            </div>
                            <MediaPreview file={data.cover_image} fallbackPath={eventItem?.cover_image} alt={eventItem?.title ?? "Cover kegiatan"} emptyLabel="Belum ada cover kegiatan" />
                        </div>
                    </FormSection>
                    <FormSection title="Status dan Jadwal">
                        <div className="grid gap-4 md:grid-cols-3">
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
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upcoming">Akan Datang</SelectItem>
                                        <SelectItem value="ongoing">Berlangsung</SelectItem>
                                        <SelectItem value="completed">Selesai</SelectItem>
                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status ? <p className="text-sm text-red-500">{errors.status}</p> : null}
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="flex items-center gap-3 rounded-lg border p-4">
                                <Checkbox checked={data.is_published} onCheckedChange={(value) => setData("is_published", !!value)} />
                                <span>Tampilkan di website publik</span>
                            </label>
                            <label className="flex items-center gap-3 rounded-lg border p-4">
                                <Checkbox checked={data.is_featured} onCheckedChange={(value) => setData("is_featured", !!value)} />
                                <span>Tandai sebagai kegiatan unggulan</span>
                            </label>
                        </div>
                    </FormSection>
                    <FormActions cancelHref={route("admin.event.index")} processing={processing} submitLabel="Simpan Kegiatan" processingLabel="Menyimpan Kegiatan..." />
                </form>
            </div>
        </AppLayout>
    );
}
