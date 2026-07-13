import PublicFooter from "@/components/public/public-footer";
import PublicNavbar from "@/components/public/public-navbar";
import PublicPageHeader from "@/components/public/public-page-header";
import { useEffect } from "react";

export default function PublicLayout({
    children,
    overlayNavbar = false,
    pageHeader = null,
    mainClassName = "",
}) {
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
            { threshold: 0.12 }
        );

        nodes.forEach((node) => {
            node.classList.add("reveal-on-scroll");
            observer.observe(node);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="public-shell">
            <PublicNavbar overlay={overlayNavbar} />
            {pageHeader ? <PublicPageHeader {...pageHeader} /> : null}
            <main className={mainClassName}>{children}</main>
            <PublicFooter />
        </div>
    );
}
