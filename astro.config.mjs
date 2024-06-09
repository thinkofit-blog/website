import { readFileSync } from "node:fs";
import { join } from "node:path";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import markdownConfig from "./markdown.config";

const pubDateRe = /^\s*pubDate\s*:\s*["']?([A-Za-z0-9.\s]+)["']?/m;

export default defineConfig({
    site: "https://thinkofit.blog",
    integrations: [
        mdx({
            ...markdownConfig,
            extendPlugins: false,
        }),
        sitemap({
            serialize(item) {
                item.lastmod ||= new Date();
                item.changefreq = "monthly";
                item.priority = 0.75;
                if (/authors/.test(item.url)) {
                    item.priority = 0.5;
                    item.lastmod = new Date("Jun 03 2024");
                } else if (/articles/.test(item.url)) {
                    const filename = join("./src/content/", new URL(item.url).pathname.replace(/\/$/, ".md"));
                    const fileContent = readFileSync(filename, "utf8");
                    const reArr = pubDateRe.exec(fileContent);
                    if (reArr?.length) {
                        item.lastmod = new Date(reArr[1]);
                    }

                    item.priority = 1;
                }
                return item;
            },
        }),
        tailwind(),
        solidJs(),
    ],
    markdown: markdownConfig,
});
