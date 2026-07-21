import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function OrganizationProfileEditPage() {
    const { profile } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        organization_name: profile?.organization_name ?? "",
        short_name: profile?.short_name ?? "",
        tagline: profile?.tagline ?? "",
        cabinet_name: profile?.cabinet_name ?? "",
        period: profile?.period ?? "",
        description: profile?.description ?? "",
        vision: profile?.vision ?? "",
        mission: profile?.mission ?? "",
        logo: null,
        address: profile?.address ?? "",
        email: profile?.email ?? "",
        phone: profile?.phone ?? "",
        instagram_url: profile?.instagram_url ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.organization-profile.update"));
    };

    const renderError = (key) => errors[key] ? <p className="text-sm text-red-500">{errors[key]}</p> : null;

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Profil Organisasi"
                    description="Perbarui identitas, kontak, dan informasi utama organisasi yang tampil di website."
                />
                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Utama" description="Data dasar organisasi dan deskripsi singkat.">
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                ["organization_name", "Nama Organisasi", "text"],
                                ["short_name", "Nama Singkat", "text"],
                                ["tagline", "Tagline", "text"],
                                ["cabinet_name", "Nama Kabinet", "text"],
                                ["period", "Periode", "text"],
                                ["email", "Email", "email"],
                                ["phone", "Telepon", "text"],
                                ["instagram_url", "URL Instagram", "url"],
                            ].map(([key, label, type]) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{label}</Label>
                                    <Input id={key} type={type} value={data[key]} onChange={(event) => setData(key, event.target.value)} />
                                    {renderError(key)}
                                </div>
                            ))}
                        </div>
                    </FormSection>

                    <FormSection title="Media" description="Unggah logo organisasi dengan format gambar dan ukuran yang wajar.">
                        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="logo">Logo Organisasi</Label>
                                <Input id="logo" type="file" accept="image/*" onChange={(event) => setData("logo", event.target.files?.[0] ?? null)} />
                                <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                {renderError("logo")}
                            </div>
                            <MediaPreview file={data.logo} fallbackPath={profile?.logo} alt={profile?.organization_name ?? "Logo organisasi"} emptyLabel="Belum ada logo" />
                        </div>
                    </FormSection>

                    <FormSection title="Konten Publik" description="Konten ini ditampilkan pada beranda dan bagian identitas website.">
                        <div className="grid gap-4">
                            {[
                                ["description", "Deskripsi Singkat", 4],
                                ["vision", "Visi", 4],
                                ["mission", "Misi", 4],
                                ["address", "Alamat", 3],
                            ].map(([key, label, rows]) => (
                                <div key={key} className="grid gap-2">
                                    <Label htmlFor={key}>{label}</Label>
                                    <Textarea id={key} rows={rows} value={data[key]} onChange={(event) => setData(key, event.target.value)} />
                                    {renderError(key)}
                                </div>
                            ))}
                        </div>
                    </FormSection>

                    <FormActions processing={processing} submitLabel="Simpan Profil" processingLabel="Menyimpan Profil..." />
                </form>
            </div>
        </AppLayout>
    );
}
