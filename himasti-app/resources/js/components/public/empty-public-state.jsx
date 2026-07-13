export default function EmptyPublicState({
    title = "Belum ada data",
    description = "Konten akan tampil di sini setelah tersedia.",
}) {
    return (
        <div
            className="rounded-sm border border-slate-200 bg-slate-50 px-6 py-10 text-center"
            data-reveal
        >
            <p className="font-editorial text-3xl font-semibold text-[#1c2032]">
                {title}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                {description}
            </p>
        </div>
    );
}
