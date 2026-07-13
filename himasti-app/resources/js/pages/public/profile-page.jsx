import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePage } from "@inertiajs/react";

export default function ProfilePage() {
    const { profile } = usePage().props;

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl px-4 py-10 md:px-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{profile?.organization_name ?? "Profil HIMASTI"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p>{profile?.description ?? "Profil organisasi belum tersedia."}</p>
                    <div>
                        <h2 className="font-semibold">Visi</h2>
                        <p>{profile?.vision ?? "-"}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Misi</h2>
                        <p>{profile?.mission ?? "-"}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Sejarah</h2>
                        <p>{profile?.history ?? "-"}</p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
