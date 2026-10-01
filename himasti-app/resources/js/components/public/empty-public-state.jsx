export default function EmptyPublicState({
    title = "Belum ada data",
    description = "Konten akan tampil di sini setelah tersedia.",
}) {
    return (
        <div
            className="relative overflow-hidden rounded-sm border border-line bg-mist px-6 py-10 text-center"
            data-reveal
        >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-volt via-aqua to-flare" />
            <p className="font-editorial text-3xl font-semibold text-ink">
                {title}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                {description}
            </p>
        </div>
    );
}
