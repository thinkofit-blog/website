import remarkToc from "remark-toc"
import rehypeToc from "rehype-toc"
import rehypeSlug from "rehype-slug"

export default {
    gfm: true,
    syntaxHighlight: "shiki",
    shikiConfig: { wrap: false, theme: "catppuccin-mocha" },
    remarkPlugins: [[remarkToc, { tight: true, ordered: true }]],
    rehypePlugins: [
        rehypeSlug,
        [
            rehypeToc,
            {
                headings: ["h1", "h2", "h3"],
                cssClasses: {
                    toc: "toc-post",
                    link: "toc-link",
                },
            },
        ],
    ],
}
