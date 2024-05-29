import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import markdownConfig from "./markdown.config"
import tailwind from "@astrojs/tailwind"

import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
    site: "https://thinkofit.blog",
    integrations: [
        mdx({
            ...markdownConfig,
            extendPlugins: false,
        }),
        sitemap(),
        tailwind(),
        solidJs(),
    ],
    markdown: markdownConfig,
    markdown: markdownConfig,
})
