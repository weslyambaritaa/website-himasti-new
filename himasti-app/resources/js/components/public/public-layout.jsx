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
                        const siblings = Array.from(
                            entry.target.parentElement?.querySelectorAll(":scope > [data-reveal]") ?? []
                        );
                        const order = Math.max(0, siblings.indexOf(entry.target));

                        entry.target.style.setProperty("--reveal-delay", `${Math.min(order, 6) * 90}ms`);
                        entry.target.classList.add("reveal-on-scroll", "is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0, rootMargin: "0px 0px -12% 0px" }
        );

        nodes.forEach((node) => {
            node.classList.add("reveal-on-scroll");

            if (node.getBoundingClientRect().bottom < 0) {
                node.classList.add("is-visible");

                return;
            }

            observer.observe(node);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;

            document.documentElement.style.setProperty("--scroll-progress", Math.min(1, Math.max(0, ratio)).toFixed(4));
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
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
