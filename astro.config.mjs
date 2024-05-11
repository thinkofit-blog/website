import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import markdownConfig from "./markdown.config"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
    site: "https://thinkaboutit.blog",
    integrations: [
        mdx({
            ...markdownConfig,
            extendPlugins: false,
        }),
        sitemap(),
        tailwind(),
    ],
    markdown: markdownConfig,

    markdown: markdownConfig,
})
