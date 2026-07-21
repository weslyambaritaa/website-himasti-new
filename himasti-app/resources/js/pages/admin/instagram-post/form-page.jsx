import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function InstagramPostFormPage() {
    const { instagramPost } = usePage().props;
    const isEdit = !!instagramPost;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        title: instagramPost?.title ?? "",
        image: null,
        instagram_url: instagramPost?.instagram_url ?? "",
        is_shown: instagramPost?.is_shown ?? true,
        published_at: instagramPost?.published_at ? instagramPost.published_at.slice(0, 16) : "",
    });

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.instagram-post.update", instagramPost.id) : route("admin.instagram-post.store"));
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title={isEdit ? "Ubah Postingan Instagram" : "Tambah Postingan Instagram"}
                    description="Postingan Instagram pada Batch 5 tetap dikelola manual tanpa integrasi API."
                />

                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Postingan" description="Masukkan judul singkat, tautan postingan Instagram, dan tanggal posting.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Judul atau Caption Singkat</Label>
                                <Input id="title" value={data.title} onChange={(event) => setData("title", event.target.value)} />
                                {errors.title ? <p className="text-sm text-red-500">{errors.title}</p> : null}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="instagram_url">Link Instagram</Label>
                                <Input id="instagram_url" type="url" value={data.instagram_url} onChange={(event) => setData("instagram_url", event.target.value)} />
                                {errors.instagram_url ? <p className="text-sm text-red-500">{errors.instagram_url}</p> : null}
                            </div>
                            <div className="grid gap-2 md:max-w-sm">
                                <Label htmlFor="published_at">Tanggal Posting</Label>
                                <Input id="published_at" type="datetime-local" value={data.published_at} onChange={(event) => setData("published_at", event.target.value)} />
                                {errors.published_at ? <p className="text-sm text-red-500">{errors.published_at}</p> : null}
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Media" description="Thumbnail lama tetap dipertahankan bila Anda menyimpan tanpa memilih file baru.">
                        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="image">Gambar Thumbnail</Label>
                                <Input id="image" type="file" accept="image/*" onChange={(event) => setData("image", event.target.files?.[0] ?? null)} />
                                <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                {errors.image ? <p className="text-sm text-red-500">{errors.image}</p> : null}
                            </div>
                            <MediaPreview file={data.image} fallbackPath={instagramPost?.image} alt={instagramPost?.title ? `Thumbnail ${instagramPost.title}` : "Thumbnail postingan Instagram"} emptyLabel="Belum ada thumbnail postingan" />
                        </div>
                    </FormSection>

                    <FormSection title="Pengaturan Tampilan" description="Status tampil menentukan apakah postingan ini muncul di landing page publik.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border p-4">
                                <label className="flex items-center gap-3">
                                    <Checkbox checked={data.is_shown} onCheckedChange={(value) => setData("is_shown", !!value)} />
                                    <span>Tampilkan postingan di landing page</span>
                                </label>
                                {errors.is_shown ? <p className="mt-2 text-sm text-red-500">{errors.is_shown}</p> : null}
                            </div>
                        </div>
                    </FormSection>

                    <FormActions cancelHref={route("admin.instagram-post.index")} processing={processing} submitLabel="Simpan Postingan Instagram" processingLabel="Menyimpan Postingan Instagram..." />
                </form>
            </div>
        </AppLayout>
    );
}
