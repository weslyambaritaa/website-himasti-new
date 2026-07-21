import { Inbox } from "lucide-react";

export default function EmptyPublicState({ title = "Belum ada data", description = "Konten akan tampil di sini setelah tersedia." }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-[#F4F6FA] px-6 py-12 text-center" data-reveal>
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#1C2032] text-white"><Inbox className="size-5" /></div>
            <p className="mt-5 text-xl font-extrabold tracking-[-0.025em] text-[#1C2032]">{title}</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
    );
}
