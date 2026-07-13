import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function NewsFormPage() {
    const { newsItem } = usePage().props;
    const isEdit = !!newsItem;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        title: newsItem?.title ?? "",
        slug: newsItem?.slug ?? "",
        cover_image: null,
        excerpt: newsItem?.excerpt ?? "",
        content: newsItem?.content ?? "",
        status: newsItem?.status ?? "draft",
        published_at: newsItem?.published_at ? newsItem.published_at.slice(0, 16) : "",
    });

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.news.update", newsItem.id) : route("admin.news.store"));
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader title={isEdit ? "Ubah Berita" : "Tambah Berita"} description="Kelola konten berita, status publikasi, dan cover untuk website publik." />
                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Berita">
                        <div className="grid gap-4 md:grid-cols-2">
                            {["title", "slug"].map((key) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{key === "title" ? "Judul" : "Slug"}</Label>
                                    <Input id={key} value={data[key]} onChange={(event) => setData(key, event.target.value)} />
                                    {errors[key] ? <p className="text-sm text-red-500">{errors[key]}</p> : null}
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="excerpt">Ringkasan</Label>
                            <Textarea id="excerpt" rows={3} value={data.excerpt} onChange={(event) => setData("excerpt", event.target.value)} />
                            {errors.excerpt ? <p className="text-sm text-red-500">{errors.excerpt}</p> : null}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Konten</Label>
                            <Textarea id="content" rows={10} value={data.content} onChange={(event) => setData("content", event.target.value)} />
                            {errors.content ? <p className="text-sm text-red-500">{errors.content}</p> : null}
                        </div>
                    </FormSection>
                    <FormSection title="Media">
                        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="cover_image">Cover Berita</Label>
                                <Input id="cover_image" type="file" accept="image/*" onChange={(event) => setData("cover_image", event.target.files?.[0] ?? null)} />
                                <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                {errors.cover_image ? <p className="text-sm text-red-500">{errors.cover_image}</p> : null}
                            </div>
                            <MediaPreview file={data.cover_image} fallbackPath={newsItem?.cover_image} alt={newsItem?.title ?? "Cover berita"} emptyLabel="Belum ada cover berita" />
                        </div>
                    </FormSection>
                    <FormSection title="Publikasi">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draf</SelectItem>
                                        <SelectItem value="published">Dipublikasikan</SelectItem>
                                        <SelectItem value="archived">Diarsipkan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status ? <p className="text-sm text-red-500">{errors.status}</p> : null}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="published_at">Waktu Publikasi</Label>
                                <Input id="published_at" type="datetime-local" value={data.published_at} onChange={(event) => setData("published_at", event.target.value)} />
                                {errors.published_at ? <p className="text-sm text-red-500">{errors.published_at}</p> : null}
                            </div>
                        </div>
                    </FormSection>
                    <FormActions cancelHref={route("admin.news.index")} processing={processing} submitLabel="Simpan Berita" processingLabel="Menyimpan Berita..." />
                </form>
            </div>
        </AppLayout>
    );
}
