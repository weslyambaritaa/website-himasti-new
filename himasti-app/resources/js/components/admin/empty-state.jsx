export default function AdminEmptyState({ title, description }) {
    return (
        <div className="rounded-xl border border-dashed px-6 py-10 text-center">
            <h3 className="text-base font-medium">{title}</h3>
            {description ? (
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            ) : null}
        </div>
    );
}
