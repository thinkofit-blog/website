import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

const manifest = JSON.stringify(
    {
        name: SITE_TITLE,
        short_name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        start_url: "/",
        display: "minimal-ui",
        background_color: "#1e1e2e",
        theme_color: "#1e1e2e",
        icons: [
            {
                src: "/images/favicon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    },
    null,
    "\t",
);

export const GET: APIRoute = () => {
    return new Response(manifest, {
        headers: {
            "Content-Type": "application/manifest+json; charset=utf-8",
        },
    });
};
