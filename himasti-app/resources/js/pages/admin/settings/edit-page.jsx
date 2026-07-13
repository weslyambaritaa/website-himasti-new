import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

const fieldGroups = [
    {
        title: "Identitas Website",
        fields: [
            ["site_title", "Judul Website", "text"],
            ["site_description", "Deskripsi Website", "textarea"],
            ["default_meta_description", "Meta Description Default", "textarea"],
            ["footer_text", "Teks Footer", "text"],
        ],
    },
    {
        title: "Kontak dan Sosial Media",
        fields: [
            ["contact_email", "Email Kontak", "email"],
            ["contact_phone", "Telepon Kontak", "text"],
            ["instagram_url", "URL Instagram", "url"],
            ["youtube_url", "URL YouTube", "url"],
        ],
    },
    {
        title: "Batas Landing Page",
        fields: [
            ["landing_news_limit", "Jumlah Berita", "number"],
            ["landing_event_limit", "Jumlah Kegiatan", "number"],
            ["landing_documentation_limit", "Jumlah Dokumentasi", "number"],
            ["landing_instagram_limit", "Jumlah Postingan Instagram", "number"],
        ],
    },
];

export default function SettingEditPage() {
    const { settings } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        settings: {
            ...settings,
            maintenance_mode: settings.maintenance_mode === "1" || settings.maintenance_mode === true,
        },
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.settings.update"));
    };

    const setSetting = (key, value) => {
        setData("settings", {
            ...data.settings,
            [key]: value,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Pengaturan"
                    description="Atur identitas website, kontak, limit landing page, dan mode maintenance publik."
                />
                <form onSubmit={submit} className="space-y-6">
                    {fieldGroups.map((group) => (
                        <FormSection key={group.title} title={group.title}>
                            <div className="grid gap-4 md:grid-cols-2">
                                {group.fields.map(([key, label, type]) => (
                                    <div key={key} className={type === "textarea" ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
                                        <Label htmlFor={key}>{label}</Label>
                                        {type === "textarea" ? (
                                            <Textarea id={key} rows={4} value={data.settings[key] ?? ""} onChange={(event) => setSetting(key, event.target.value)} />
                                        ) : (
                                            <Input id={key} type={type} value={data.settings[key] ?? ""} onChange={(event) => setSetting(key, event.target.value)} />
                                        )}
                                        {errors[`settings.${key}`] ? <p className="text-sm text-red-500">{errors[`settings.${key}`]}</p> : null}
                                    </div>
                                ))}
                            </div>
                        </FormSection>
                    ))}
                    <FormSection title="Mode Maintenance" description="Hanya halaman publik yang dialihkan ke halaman maintenance. Halaman admin dan autentikasi tetap bisa diakses.">
                        <label className="flex items-center gap-3 rounded-lg border p-4">
                            <Checkbox checked={!!data.settings.maintenance_mode} onCheckedChange={(value) => setSetting("maintenance_mode", !!value)} />
                            <span>Aktifkan mode maintenance publik</span>
                        </label>
                        {errors["settings.maintenance_mode"] ? <p className="text-sm text-red-500">{errors["settings.maintenance_mode"]}</p> : null}
                        {errors.settings ? <p className="text-sm text-red-500">{errors.settings}</p> : null}
                    </FormSection>
                    <FormActions processing={processing} submitLabel="Simpan Pengaturan" processingLabel="Menyimpan Pengaturan..." />
                </form>
            </div>
        </AppLayout>
    );
}
