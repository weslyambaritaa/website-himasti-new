import FlashAlert from "@/components/admin/flash-alert";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTheme } from "@/providers/theme-provider";

import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

import * as Icon from "@tabler/icons-react";
import { Moon, Sun } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function AppLayout({ children }) {
    const { auth, appName, pageName, flash, adminNavigation } = usePage().props;
    const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();
    const colorThemes = [
        "blue",
        "green",
        "default",
        "orange",
        "red",
        "rose",
        "violet",
        "yellow",
    ];
    const iconMap = {
        Dashboard: Icon.IconHome,
        Todo: Icon.IconChecklist,
        "Profil Organisasi": Icon.IconBuildingCommunity,
        "Hak Akses": Icon.IconLock,
        Banner: Icon.IconCarouselHorizontal,
        Berita: Icon.IconNews,
        Kegiatan: Icon.IconCalendarEvent,
        Divisi: Icon.IconHierarchy,
        "Anggota Divisi": Icon.IconUsers,
        "Program Kerja": Icon.IconClipboardList,
        Dokumentasi: Icon.IconPhoto,
        "Postingan Instagram": Icon.IconBrandInstagram,
        Layanan: Icon.IconLink,
        Pengaturan: Icon.IconSettings,
    };

    const navData = (adminNavigation ?? []).map((group) => ({
        ...group,
        items: group.items.map((item) => ({
            ...item,
            icon: iconMap[item.title] ?? Icon.IconCircle,
        })),
    }));

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <>
            <SidebarProvider
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                }}
            >
                <AppSidebar
                    active={pageName}
                    user={auth}
                    navData={navData}
                    appName={appName}
                    variant="inset"
                />
                <SidebarInset>
                    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
                        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mx-2 data-[orientation=vertical]:h-4"
                            />
                            <h1 className="text-base font-medium">
                                {pageName}
                            </h1>
                            <div className="ml-auto flex items-center gap-2">
                                <Select
                                    className="capitalize"
                                    value={colorTheme}
                                    onValueChange={setColorTheme}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tema" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Tema</SelectLabel>
                                            {colorThemes.map((item) => (
                                                <SelectItem
                                                    key={`theme-${item}`}
                                                    value={item}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                >
                                    {theme === "light" ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
                                <FlashAlert />
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster richColors position="top-center" />
        </>
    );
}
