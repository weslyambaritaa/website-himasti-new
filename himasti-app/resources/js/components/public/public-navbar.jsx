import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { route } from "ziggy-js";

const navItems = [
    { label: "Beranda", href: () => route("public.home"), match: "/" },
    { label: "Berita", href: () => route("public.news.index"), match: "/berita" },
    { label: "Kegiatan", href: () => route("public.event.index"), match: "/kegiatan" },
    { label: "Program Kerja", href: () => route("work-programs.index"), match: "/program-kerja" },
    { label: "Dokumentasi", href: () => route("public.documentation.index"), match: "/dokumentasi" },
];

function NavLink({ href, active, children, inverted = false, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                inverted
                    ? active
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                    : active
                      ? "text-[#1c2032]"
                      : "text-slate-600 hover:text-[#1c2032]"
            )}
        >
            {children}
        </Link>
    );
}

export default function PublicNavbar({ overlay = false }) {
    const { publicNavigation, publicAuth, publicIdentity } = usePage().props;
    const currentUrl = usePage().url ?? "/";
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const divisionItems = publicNavigation?.items ?? [];

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 24);

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isOverlay = overlay && !isScrolled;
    const navClassName = useMemo(
        () => cn(
            "fixed inset-x-0 top-0 z-50 transition duration-300",
            isOverlay ? "bg-transparent" : "border-b border-slate-200 bg-white/96 backdrop-blur"
        ),
        [isOverlay]
    );

    const brandTextClass = isOverlay ? "text-white" : "text-[#1c2032]";

    return (
        <nav aria-label="Navigasi publik" className={navClassName}>
            <div className="public-container flex h-20 items-center justify-between gap-6">
                <Link href={route("public.home")} className="min-w-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                    <div className={cn("font-editorial text-3xl font-semibold leading-none", brandTextClass)}>
                        {publicIdentity?.site_title ?? "HIMASTI"}
                    </div>
                </Link>

                <div className="hidden items-center gap-8 lg:flex">
                    {navItems.slice(0, 3).map((item) => (
                        <NavLink
                            key={item.label}
                            href={item.href()}
                            active={currentUrl === item.match || currentUrl.startsWith(`${item.match}/`)}
                            inverted={isOverlay}
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(
                            "inline-flex items-center gap-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                            isOverlay ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-[#1c2032]"
                        )}>
                            Divisi
                            <ChevronDown className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-64 rounded-sm border-slate-200 p-2">
                            {divisionItems.map((item) => (
                                item.href ? (
                                    <DropdownMenuItem key={item.label} asChild>
                                        <Link href={item.href} className="cursor-pointer rounded-sm px-3 py-2">
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem key={item.label} disabled className="rounded-sm px-3 py-2">
                                        {item.label}
                                    </DropdownMenuItem>
                                )
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {navItems.slice(3).map((item) => (
                        <NavLink
                            key={item.label}
                            href={item.href()}
                            active={currentUrl === item.match || currentUrl.startsWith(`${item.match}/`)}
                            inverted={isOverlay}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-3 lg:flex">
                    {publicAuth?.canAccessAdmin ? (
                        <Button
                            asChild
                            variant={isOverlay ? "secondary" : "outline"}
                            className={cn(isOverlay ? "bg-white text-[#1c2032] hover:bg-white/90" : "border-slate-300")}
                        >
                            <Link href={route("home")}>Masuk Admin</Link>
                        </Button>
                    ) : null}
                </div>

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(isOverlay ? "text-white hover:bg-white/10 hover:text-white" : "text-[#1c2032]")}
                            aria-label="Buka menu"
                        >
                            <Menu className="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full max-w-sm border-l-slate-200 bg-white">
                        <SheetHeader className="border-b border-slate-200 pb-6">
                            <SheetTitle className="font-editorial text-4xl text-[#1c2032]">
                                {publicIdentity?.site_title ?? "HIMASTI"}
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-8 px-4 py-6">
                            <div className="space-y-4">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        href={item.href()}
                                        active={currentUrl === item.match || currentUrl.startsWith(`${item.match}/`)}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <p className="public-kicker">Divisi</p>
                                <div className="grid gap-3">
                                    {divisionItems.map((item) => (
                                        item.href ? (
                                            <NavLink key={item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                                                {item.label}
                                            </NavLink>
                                        ) : (
                                            <span key={item.label} className="text-sm text-slate-400">
                                                {item.label}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                            {publicAuth?.canAccessAdmin ? (
                                <Button asChild className="w-full bg-[#1c2032] text-white hover:bg-[#252b43]">
                                    <Link href={route("home")} onClick={() => setMobileOpen(false)}>
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
