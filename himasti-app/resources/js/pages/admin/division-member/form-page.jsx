import FormActions from "@/components/admin/form-actions";
import FormSection from "@/components/admin/form-section";
import AdminPageHeader from "@/components/admin/page-header";
import MediaPreview from "@/components/media-preview";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function DivisionMemberFormPage() {
    const { divisionMember, divisions } = usePage().props;
    const isEdit = !!divisionMember;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "put" : "post",
        division_id: divisionMember?.division_id?.toString() ?? "",
        name: divisionMember?.name ?? "",
        position: divisionMember?.position ?? "",
        photo: null,
        period: divisionMember?.period ?? "",
        is_active: divisionMember?.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(isEdit ? route("admin.division-member.update", divisionMember.id) : route("admin.division-member.store"));
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title={isEdit ? "Ubah Anggota Divisi" : "Tambah Anggota Divisi"}
                    description="Lengkapi data pengurus dan penempatan divisi pada halaman publik."
                />

                <form onSubmit={submit} className="space-y-6">
                    <FormSection title="Informasi Anggota" description="Masukkan nama pengurus dan jabatan yang akan ditampilkan di profil divisi.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" value={data.name} onChange={(event) => setData("name", event.target.value)} />
                                {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="position">Jabatan</Label>
                                <Input id="position" value={data.position} onChange={(event) => setData("position", event.target.value)} />
                                {errors.position ? <p className="text-sm text-red-500">{errors.position}</p> : null}
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Penempatan Divisi" description="Pilih divisi dan periode kepengurusan anggota.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="division_id">Divisi</Label>
                                <Select value={data.division_id} onValueChange={(value) => setData("division_id", value)}>
                                    <SelectTrigger id="division_id" aria-label="Pilih divisi">
                                        <SelectValue placeholder="Pilih divisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {divisions.map((division) => (
                                            <SelectItem key={division.id} value={division.id.toString()}>{division.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.division_id ? <p className="text-sm text-red-500">{errors.division_id}</p> : null}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="period">Periode</Label>
                                <Input id="period" value={data.period} onChange={(event) => setData("period", event.target.value)} placeholder="Contoh: 2026/2027" />
                                {errors.period ? <p className="text-sm text-red-500">{errors.period}</p> : null}
                            </div>
                            <div className="rounded-lg border p-4">
                                <label className="flex items-center gap-3">
                                    <Checkbox checked={data.is_active} onCheckedChange={(value) => setData("is_active", !!value)} />
                                    <span>Aktifkan anggota divisi</span>
                                </label>
                                {errors.is_active ? <p className="mt-2 text-sm text-red-500">{errors.is_active}</p> : null}
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Foto dan Tampilan" description="Foto lama tetap aman bila Anda menyimpan tanpa memilih file baru.">
                        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                            <div className="grid gap-2">
                                <Label htmlFor="photo">Foto Anggota</Label>
                                <Input id="photo" type="file" accept="image/*" onChange={(event) => setData("photo", event.target.files?.[0] ?? null)} />
                                <p className="text-xs text-muted-foreground">Format gambar, maksimal 4 MB.</p>
                                {errors.photo ? <p className="text-sm text-red-500">{errors.photo}</p> : null}
                            </div>
                            <MediaPreview file={data.photo} fallbackPath={divisionMember?.photo} alt={divisionMember?.name ? `Foto ${divisionMember.name}` : "Foto anggota divisi"} emptyLabel="Belum ada foto anggota divisi" />
                        </div>
                    </FormSection>

                    <FormActions cancelHref={route("admin.division-member.index")} processing={processing} submitLabel="Simpan Anggota Divisi" processingLabel="Menyimpan Anggota Divisi..." />
                </form>
            </div>
        </AppLayout>
    );
}
