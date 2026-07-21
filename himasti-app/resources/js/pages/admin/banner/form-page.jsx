import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function BannerFormPage() {
    const { banner } = usePage().props;
    const isEdit = !!banner;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        title: banner?.title ?? "",
        subtitle: banner?.subtitle ?? "",
        image: null,
        button_text: banner?.button_text ?? "",
        button_url: banner?.button_url ?? "",
        is_shown: banner?.is_shown ?? false,
    });

    const submit = (event) => {
        event.preventDefault();
        post(
            isEdit
                ? route("admin.banner.update", banner.id)
                : route("admin.banner.store"),
        );
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title={isEdit ? "Ubah Banner" : "Tambah Banner"}
                    description="Atur judul, gambar, tombol, dan visibilitas banner pada landing page."
                    action={<ButtonBack />}
                />
                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Banner">
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                ["title", "Judul", "text"],
                                ["button_text", "Teks Tombol", "text"],
                                ["button_url", "URL Tombol", "text"],
                            ].map(([key, label, type]) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{label}</Label>
                                    <Input
                                        id={key}
                                        type={type}
                                        value={data[key]}
                                        placeholder={
                                            key === "button_url"
                                                ? "Contoh: /berita atau https://example.com"
                                                : undefined
                                        }
                                        onChange={(event) =>
                                            setData(key, event.target.value)
                                        }
                                    />
                                    {errors[key] ? (
                                        <p className="text-sm text-red-500">
                                            {errors[key]}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Textarea
                                id="subtitle"
                                rows={4}
                                value={data.subtitle}
                                onChange={(event) =>
                                    setData("subtitle", event.target.value)
                                }
                            />
                            {errors.subtitle ? (
                                <p className="text-sm text-red-500">
                                    {errors.subtitle}
                                </p>
                            ) : null}
                        </div>
                    </FormSection>
                    <FormSection
                        title="Media"
                        description="Unggah gambar banner dengan ukuran proporsional agar tetap nyaman di desktop dan mobile."
                    >
                        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="image">Gambar Banner</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        setData(
                                            "image",
                                            event.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format gambar, maksimal 4 MB.
                                </p>
                                {errors.image ? (
                                    <p className="text-sm text-red-500">
                                        {errors.image}
                                    </p>
                                ) : null}
                            </div>
                            <MediaPreview
                                file={data.image}
                                fallbackPath={banner?.image}
                                alt={banner?.title ?? "Banner"}
                                emptyLabel="Belum ada gambar banner"
                            />
                        </div>
                    </FormSection>
                    <FormSection title="Tampilan">
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex items-center gap-3 rounded-lg border p-4">
                                <Checkbox
                                    checked={data.is_shown}
                                    onCheckedChange={(value) =>
                                        setData("is_shown", !!value)
                                    }
                                />
                                <span>Tampilkan banner di landing page</span>
                            </label>
                        </div>
                    </FormSection>
                    <FormActions
                        cancelHref={route("admin.banner.index")}
                        processing={processing}
                    />
                </form>
            </div>
        </AppLayout>
    );
}

function ButtonBack() {
    return (
        <Link
            href={route("admin.banner.index")}
            className="inline-flex h-9 items-center rounded-md border px-4 text-sm"
        >
            Kembali
        </Link>
    );
}
