import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./providers/theme-provider";
import { Ziggy } from "./ziggy.js";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.jsx");
        const page = pages[`./pages/${name}.jsx`];

        if (!page) {
            throw new Error(`Halaman Inertia tidak ditemukan: ${name}`);
        }

        return page();
    },
    setup({ el, App, props }) {
        // Inject Ziggy routes ke props
        if (props.initialPage.props.ziggy) {
            props.initialPage.props.ziggy = {
                ...Ziggy,
                location: new URL(Ziggy.url).href, // Convert to string
            };
        }

        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
});
