import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";

export default function AdminModulePlaceholderPage() {
    const { moduleName } = usePage().props;

    return (
        <AppLayout>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>{moduleName}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Fondasi modul admin ini sudah disiapkan pada Batch 1 dan
                    akan dilengkapi pada batch CRUD berikutnya.
                </CardContent>
            </Card>
        </AppLayout>
    );
}
