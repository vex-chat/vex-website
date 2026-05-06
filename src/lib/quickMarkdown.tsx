import { Fragment } from "preact";
import type { ComponentChildren } from "preact";

const DEFAULT_LINK_CLASS =
    "text-red-200 underline decoration-red-400/60 underline-offset-4 hover:text-red-100";

/** Neutral links for site-owned docs (e.g. `/overview`). */
export const SITE_DOC_LINK_CLASS =
    "text-zinc-200 underline decoration-white/25 underline-offset-4 hover:text-white";

export type MarkdownTocItem = {
    level: number;
    text: string;
    id: string;
};

type QuickMarkdownContext = {
    linkClassName: string;
    headingIdByLine: Map<number, string> | null;
    headingAnchorOffset: boolean;
};

function stripInlineMd(s: string): string {
    return s
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function slugifyForAnchor(s: string): string {
    return stripInlineMd(s)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function assignHeadingIds(lines: string[]): Map<number, string> {
    const used = new Set<string>();
    const map = new Map<number, string>();
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^(#{1,6})\s+(.+)$/);
        if (!m) continue;
        const plain = stripInlineMd(m[2]);
        let base = slugifyForAnchor(plain);
        if (!base) base = "section";
        let slug = base;
        let n = 2;
        while (used.has(slug)) {
            slug = `${base}-${n}`;
            n++;
        }
        used.add(slug);
        map.set(i, slug);
    }
    return map;
}

/** Build a table of contents from `##` / `###` (and deeper) headings; IDs match rendered heading `id`s. */
export function buildMarkdownOutline(markdown: string): MarkdownTocItem[] {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const idByLine = assignHeadingIds(lines);
    const out: MarkdownTocItem[] = [];
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^(#{1,6})\s+(.+)$/);
        if (!m) continue;
        const id = idByLine.get(i);
        if (!id) continue;
        out.push({
            level: m[1].length,
            text: stripInlineMd(m[2]),
            id,
        });
    }
    return out;
}

function parseInline(text: string, ctx: QuickMarkdownContext): ComponentChildren[] {
    const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
    const nodes: ComponentChildren[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        const token = match[0];
        if (token.startsWith("`")) {
            nodes.push(
                <code
                    key={`${match.index}-code`}
                    className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-100"
                >
                    {token.slice(1, -1)}
                </code>
            );
        } else if (token.startsWith("**")) {
            nodes.push(
                <strong key={`${match.index}-bold`}>
                    {token.slice(2, -2)}
                </strong>
            );
        } else if (token.startsWith("*")) {
            nodes.push(
                <em key={`${match.index}-italic`}>{token.slice(1, -1)}</em>
            );
        } else if (token.startsWith("[")) {
            const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
                const href = linkMatch[2];
                const isExternal = /^https?:\/\//i.test(href);
                nodes.push(
                    <a
                        key={`${match.index}-link`}
                        href={href}
                        {...(isExternal
                            ? { target: "_blank", rel: "noreferrer" as const }
                            : {})}
                        className={ctx.linkClassName}
                    >
                        {linkMatch[1]}
                    </a>
                );
            } else {
                nodes.push(token);
            }
        }

        lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
}

function headingClass(level: number, anchorOffset: boolean): string {
    const scroll = anchorOffset ? " scroll-mt-28" : "";
    if (level === 1)
        return `mt-8 text-3xl font-bold tracking-tight text-zinc-50${scroll}`;
    if (level === 2)
        return `mt-7 text-2xl font-semibold tracking-tight text-zinc-50${scroll}`;
    if (level === 3) return `mt-6 text-xl font-semibold text-zinc-100${scroll}`;
    return `mt-5 text-lg font-semibold text-zinc-100${scroll}`;
}

export type RenderQuickMarkdownOptions = {
    /** Defaults to policy-style red links. */
    linkClassName?: string;
    /** When false, headings do not get `id` attributes (legacy behavior). */
    headingIds?: boolean;
};

export function renderQuickMarkdown(
    markdown: string,
    options?: RenderQuickMarkdownOptions
): ComponentChildren[] {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const headingIds = options?.headingIds !== false;
    const headingIdByLine = headingIds ? assignHeadingIds(lines) : null;
    const ctx: QuickMarkdownContext = {
        linkClassName: options?.linkClassName ?? DEFAULT_LINK_CLASS,
        headingIdByLine,
        headingAnchorOffset: Boolean(headingIdByLine),
    };
    const result: ComponentChildren[] = [];
    let i = 0;

    while (i < lines.length) {
        const raw = lines[i];
        const line = raw.trim();

        if (!line) {
            i++;
            continue;
        }

        if (line.startsWith("```")) {
            const codeLines: string[] = [];
            const fence = line;
            i++;
            while (i < lines.length && lines[i].trim() !== fence) {
                codeLines.push(lines[i]);
                i++;
            }
            i++;
            result.push(
                <pre
                    key={`code-${i}`}
                    className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/80 p-4 text-sm leading-6 text-zinc-200"
                >
                    <code>{codeLines.join("\n")}</code>
                </pre>
            );
            continue;
        }

        const heading = raw.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            const content = parseInline(heading[2], ctx);
            const className = headingClass(level, ctx.headingAnchorOffset);
            const id = headingIdByLine?.get(i);
            const idProp = id ? { id } : {};
            if (level === 1)
                result.push(
                    <h1 key={`h-${i}`} className={className} {...idProp}>
                        {content}
                    </h1>
                );
            else if (level === 2)
                result.push(
                    <h2 key={`h-${i}`} className={className} {...idProp}>
                        {content}
                    </h2>
                );
            else if (level === 3)
                result.push(
                    <h3 key={`h-${i}`} className={className} {...idProp}>
                        {content}
                    </h3>
                );
            else if (level === 4)
                result.push(
                    <h4 key={`h-${i}`} className={className} {...idProp}>
                        {content}
                    </h4>
                );
            else if (level === 5)
                result.push(
                    <h5 key={`h-${i}`} className={className} {...idProp}>
                        {content}
                    </h5>
                );
            else
                result.push(
                    <h6 key={`h-${i}`} className={className} {...idProp}>
                        {content}
                    </h6>
                );
            i++;
            continue;
        }

        if (/^(-{3,}|\*{3,})$/.test(line)) {
            result.push(
                <hr key={`hr-${i}`} className="mt-6 border-white/10" />
            );
            i++;
            continue;
        }

        if (line.startsWith(">")) {
            const quoteLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith(">")) {
                quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
                i++;
            }
            result.push(
                <blockquote
                    key={`q-${i}`}
                    className="mt-5 border-l-2 border-red-300/70 pl-4 text-zinc-300"
                >
                    {parseInline(quoteLines.join(" "), ctx)}
                </blockquote>
            );
            continue;
        }

        const unordered = raw.match(/^\s*[-*]\s+(.+)$/);
        if (unordered) {
            const items: string[] = [];
            while (i < lines.length && /^\s*[-*]\s+(.+)$/.test(lines[i])) {
                items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
                i++;
            }
            result.push(
                <ul
                    key={`ul-${i}`}
                    className="mt-4 list-disc space-y-1 pl-6 text-zinc-200"
                >
                    {items.map((item, index) => (
                        <li key={`ul-${i}-${index}`}>
                            {parseInline(item, ctx)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        const ordered = raw.match(/^\s*\d+\.\s+(.+)$/);
        if (ordered) {
            const items: string[] = [];
            while (i < lines.length && /^\s*\d+\.\s+(.+)$/.test(lines[i])) {
                items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
                i++;
            }
            result.push(
                <ol
                    key={`ol-${i}`}
                    className="mt-4 list-decimal space-y-1 pl-6 text-zinc-200"
                >
                    {items.map((item, index) => (
                        <li key={`ol-${i}-${index}`}>
                            {parseInline(item, ctx)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        const paragraphLines: string[] = [raw];
        i++;
        while (i < lines.length && lines[i].trim()) {
            if (
                /^(#{1,6})\s+/.test(lines[i]) ||
                /^(```)/.test(lines[i].trim()) ||
                /^(-{3,}|\*{3,})$/.test(lines[i].trim()) ||
                /^\s*[-*]\s+/.test(lines[i]) ||
                /^\s*\d+\.\s+/.test(lines[i]) ||
                lines[i].trim().startsWith(">")
            ) {
                break;
            }
            paragraphLines.push(lines[i]);
            i++;
        }

        result.push(
            <p key={`p-${i}`} className="mt-4 leading-7 text-zinc-200">
                {parseInline(paragraphLines.join(" "), ctx)}
            </p>
        );
    }

    return result.map((node, idx) => (
        <Fragment key={`md-${idx}`}>{node}</Fragment>
    ));
}
