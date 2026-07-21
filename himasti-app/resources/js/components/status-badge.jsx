import { Badge } from "@/components/ui/badge";

const variants = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "bg-slate-100 text-slate-700 border-slate-200",
    published: "bg-emerald-100 text-emerald-700 border-emerald-200",
    draft: "bg-amber-100 text-amber-700 border-amber-200",
    archived: "bg-slate-100 text-slate-700 border-slate-200",
    planned: "bg-sky-100 text-sky-700 border-sky-200",
    ongoing: "bg-indigo-100 text-indigo-700 border-indigo-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    shown: "bg-emerald-100 text-emerald-700 border-emerald-200",
    hidden: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function StatusBadge({ label, tone = "inactive" }) {
    return (
        <Badge variant="outline" className={variants[tone] ?? variants.inactive}>
            {label}
        </Badge>
    );
}
