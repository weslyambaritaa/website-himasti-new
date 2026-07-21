import PublicFooter from "@/components/public/public-footer";
import PublicNavbar from "@/components/public/public-navbar";
import PublicPageHeader from "@/components/public/public-page-header";
import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";

export default function PublicLayout({
    children,
    overlayNavbar = false,
    pageHeader = null,
    mainClassName = "",
    title = null,
    description = null,
}) {
    const { publicIdentity, pageName } = usePage().props;
    const siteTitle = publicIdentity?.site_title ?? "HIMASTI";
    const pageTitle = title ?? pageHeader?.title ?? pageName;
    const fullTitle = pageTitle && pageTitle !== siteTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
    const metaDescription = description ?? pageHeader?.description ?? publicIdentity?.default_meta_description ?? publicIdentity?.site_description;

    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            nodes.forEach((node) => node.classList.add("reveal-on-scroll", "is-visible"));
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-on-scroll", "is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        nodes.forEach((node) => {
            node.classList.add("reveal-on-scroll");
            observer.observe(node);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="public-shell">
            <Head title={fullTitle}>
                {metaDescription ? <meta name="description" content={metaDescription} /> : null}
            </Head>
            <PublicNavbar overlay={overlayNavbar} />
            {pageHeader ? <PublicPageHeader {...pageHeader} /> : null}
            <main className={mainClassName}>{children}</main>
            <PublicFooter />
        </div>
    );
}
