import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { resolvePublicLogo } from "@/lib/public-brand";
import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { route } from "ziggy-js";

const navItems = [
    { label: "Beranda", href: () => route("public.home"), match: "/" },
    {
        label: "Berita",
        href: () => route("public.news.index"),
        match: "/berita",
    },
    {
        label: "Kegiatan",
        href: () => route("public.event.index"),
        match: "/kegiatan",
    },
    {
        label: "Program Kerja",
        href: () => route("work-programs.index"),
        match: "/program-kerja",
    },
    {
        label: "Dokumentasi",
        href: () => route("public.documentation.index"),
        match: "/dokumentasi",
    },
    {
        label: "Layanan",
        href: () => route("public.service.index"),
        match: "/layanan",
    },
];

function isActive(currentUrl, match) {
    if (match === "/") return currentUrl === "/";
    return currentUrl === match || currentUrl.startsWith(`${match}/`);
}

function NavLink({ href, active, children, inverted = false, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "relative py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-current after:transition-transform",
                active && "after:scale-x-100",
                inverted
                    ? "text-white/82 hover:text-white"
                    : "text-slate-600 hover:text-[#1C2032]",
                active && (inverted ? "text-white" : "text-[#1C2032]"),
            )}
        >
            {children}
        </Link>
    );
}

export default function PublicNavbar({ overlay = false }) {
    const { publicNavigation, publicAuth, publicIdentity, publicProfileMeta } =
        usePage().props;
    const currentUrl = usePage().url ?? "/";
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const divisionItems = publicNavigation?.items ?? [];
    const logoSrc = resolvePublicLogo(publicProfileMeta);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 28);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isOverlay = overlay && !isScrolled;
    const navClassName = useMemo(
        () =>
            cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                isOverlay
                    ? "border-b border-white/10 bg-[#1C2032]/15"
                    : "border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(28,32,50,0.05)] backdrop-blur-xl",
            ),
        [isOverlay],
    );

    return (
        <nav aria-label="Navigasi publik" className={navClassName}>
            <div className="public-container flex h-20 items-center justify-between gap-6">
                <Link
                    href={route("public.home")}
                    className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    <img
                        src={logoSrc}
                        alt={publicIdentity?.site_title ?? "Logo HIMASTI"}
                        className={cn(
                            "h-10 w-auto max-w-[8.5rem] object-contain transition duration-300 lg:h-11 lg:max-w-[9.5rem]",
                            isOverlay ? "brightness-0 invert" : "",
                        )}
                    />
                    {publicProfileMeta?.period ? (
                        <div className="hidden min-w-0 sm:block">
                            <p
                                className={cn(
                                    "truncate text-[0.65rem] font-bold uppercase tracking-[0.18em]",
                                    isOverlay
                                        ? "text-white/70"
                                        : "text-slate-500",
                                )}
                            >
                                Periode
                            </p>
                            <p
                                className={cn(
                                    "truncate text-sm font-extrabold",
                                    isOverlay ? "text-white" : "text-[#1C2032]",
                                )}
                            >
                                {publicProfileMeta.period}
                            </p>
                        </div>
                    ) : null}
                </Link>

                <div className="hidden items-center gap-6 xl:flex">
                    {navItems.slice(0, 3).map((item) => (
                        <NavLink
                            key={item.label}
                            href={item.href()}
                            active={isActive(currentUrl, item.match)}
                            inverted={isOverlay}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(
                                "inline-flex items-center gap-1.5 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                                isOverlay
                                    ? "text-white/82 hover:text-white"
                                    : "text-slate-600 hover:text-[#1C2032]",
                            )}
                        >
                            Divisi <ChevronDown className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="center"
                            className="w-72 rounded-xl border-slate-200 p-2 shadow-xl"
                        >
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("public.division.index")}
                                    className="cursor-pointer rounded-lg px-3 py-2.5 font-semibold"
                                >
                                    Semua Divisi
                                </Link>
                            </DropdownMenuItem>
                            {divisionItems.map((item) =>
                                item.href ? (
                                    <DropdownMenuItem key={item.label} asChild>
                                        <Link
                                            href={item.href}
                                            className="cursor-pointer rounded-lg px-3 py-2.5"
                                        >
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        key={item.label}
                                        disabled
                                        className="rounded-lg px-3 py-2.5"
                                    >
                                        {item.label}
                                    </DropdownMenuItem>
                                ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {navItems.slice(3).map((item) => (
                        <NavLink
                            key={item.label}
                            href={item.href()}
                            active={isActive(currentUrl, item.match)}
                            inverted={isOverlay}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-3 xl:flex">
                    {publicAuth?.canAccessAdmin ? (
                        <Button
                            asChild
                            className={cn(
                                "rounded-full px-5",
                                isOverlay
                                    ? "bg-white text-[#1C2032] hover:bg-white/90"
                                    : "bg-[#1C2032] text-white hover:bg-[#292f49]",
                            )}
                        >
                            <Link href={route("home")}>Masuk Admin</Link>
                        </Button>
                    ) : null}
                </div>

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild className="xl:hidden">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-full",
                                isOverlay
                                    ? "text-white hover:bg-white/10 hover:text-white"
                                    : "text-[#1C2032]",
                            )}
                            aria-label="Buka menu"
                        >
                            <Menu className="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-full max-w-sm border-l-slate-200 bg-white px-0"
                    >
                        <SheetHeader className="border-b border-slate-200 px-6 pb-5">
                            <SheetTitle className="text-left text-2xl font-extrabold text-[#1C2032]">
                                {publicProfileMeta?.short_name ?? "HIMASTI"}
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex h-[calc(100vh-6rem)] flex-col overflow-y-auto px-6 py-6">
                            <div className="grid gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href()}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "rounded-xl px-4 py-3 text-sm font-semibold",
                                            isActive(currentUrl, item.match)
                                                ? "bg-[#1C2032] text-white"
                                                : "text-slate-700 hover:bg-slate-100",
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Link
                                    href={route("public.division.index")}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "rounded-xl px-4 py-3 text-sm font-semibold",
                                        currentUrl.startsWith("/divisi")
                                            ? "bg-[#1C2032] text-white"
                                            : "text-slate-700 hover:bg-slate-100",
                                    )}
                                >
                                    Divisi
                                </Link>
                            </div>
                            {divisionItems.length ? (
                                <div className="mt-8 border-t border-slate-200 pt-6">
                                    <p className="public-kicker">
                                        Daftar Divisi
                                    </p>
                                    <div className="mt-3 grid gap-1">
                                        {divisionItems.map((item) =>
                                            item.href ? (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() =>
                                                        setMobileOpen(false)
                                                    }
                                                    className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-[#1C2032]"
                                                >
                                                    {item.label}
                                                </Link>
                                            ) : null,
                                        )}
                                    </div>
                                </div>
                            ) : null}
                            {publicAuth?.canAccessAdmin ? (
                                <Button
                                    asChild
                                    className="mt-auto w-full rounded-xl bg-[#1C2032] text-white hover:bg-[#292f49]"
                                >
                                    <Link
                                        href={route("home")}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Masuk Admin
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
