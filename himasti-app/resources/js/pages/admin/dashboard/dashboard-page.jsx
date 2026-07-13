import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";

export default function AdminDashboardPage() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Halo, {auth?.name ?? "Admin"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        Dashboard admin sekarang berada di bawah struktur
                        `/admin` dan siap menjadi pusat pengelolaan konten.
                    </p>
                    <p>
                        Batch 1 menyelesaikan fondasi arsitektur, route, dan
                        database tanpa memutus autentikasi lama.
                    </p>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
