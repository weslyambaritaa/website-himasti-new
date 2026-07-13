import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePage } from "@inertiajs/react";

export default function ContentPlaceholderPage() {
    const { pageName, slug } = usePage().props;

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl px-4 py-10 md:px-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{pageName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Halaman publik ini sudah disiapkan pada Batch 1.</p>
                    {slug ? <p>Slug: {slug}</p> : null}
                </CardContent>
            </Card>
        </main>
    );
}
