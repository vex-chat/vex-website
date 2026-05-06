import { useEffect, useState } from "preact/hooks";
import { CrosshairSpinner } from "../components/CrosshairSpinner";
import { RoutePanel } from "../components/RoutePanel";
import {
    buildMarkdownOutline,
    renderQuickMarkdown,
    SITE_DOC_LINK_CLASS,
    type MarkdownTocItem,
} from "../lib/quickMarkdown";

/** Canonical Markdown on `master` (same pattern as privacy policy). */
const SITE_OVERVIEW_RAW_URL =
    "https://raw.githubusercontent.com/vex-protocol/vex.wtf/master/docs/SiteOverview.md";

const SITE_OVERVIEW_EDIT_ON_GITHUB =
    "https://github.com/vex-protocol/vex.wtf/blob/master/docs/SiteOverview.md";

export function OverviewPage(_: { path?: string }): JSX.Element {
    const [markdown, setMarkdown] = useState("");
    const [toc, setToc] = useState<MarkdownTocItem[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setStatus("loading");
                const response = await fetch(SITE_OVERVIEW_RAW_URL);
                if (!response.ok) {
                    throw new Error(String(response.status));
                }
                const text = await response.text();
                if (!cancelled) {
                    setMarkdown(text);
                    setToc(
                        buildMarkdownOutline(text).filter(
                            (item) => item.level >= 2 && item.level <= 3
                        )
                    );
                    setStatus("idle");
                }
            } catch {
                if (!cancelled) {
                    setStatus("error");
                }
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <RoutePanel splotch="soft">
            {status === "loading" ? (
                <div className="inline-flex items-center gap-2.5 text-zinc-300">
                    <CrosshairSpinner className="text-zinc-200" />
                    <span>Loading overview</span>
                </div>
            ) : null}

            {status === "error" ? (
                <p className="text-red-300">
                    Could not load the overview document. Try again later or open
                    the source on{" "}
                    <a
                        href={SITE_OVERVIEW_EDIT_ON_GITHUB}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-red-400/60 underline-offset-2 hover:text-red-200"
                    >
                        GitHub
                    </a>
                    .
                </p>
            ) : null}

            {status === "idle" && markdown ? (
                <div className="lg:grid lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
                    {toc.length > 0 ? (
                        <MarkdownTocNav items={toc} />
                    ) : null}
                    <div className="min-w-0">
                        <p className="mt-0 text-sm text-zinc-500">
                            Browseable overview ·{" "}
                            <a
                                href={SITE_OVERVIEW_EDIT_ON_GITHUB}
                                target="_blank"
                                rel="noreferrer"
                                className="text-zinc-400 underline decoration-white/20 underline-offset-2 hover:text-zinc-200"
                            >
                                Edit on GitHub
                            </a>
                        </p>
                        <article className="max-w-none [&>h1:first-of-type]:mt-2 [&>h1:first-of-type]:text-2xl [&>h1:first-of-type]:font-bold [&>h1:first-of-type]:tracking-tight sm:[&>h1:first-of-type]:text-3xl [&>p:first-of-type]:mt-0">
                            {renderQuickMarkdown(markdown, {
                                linkClassName: SITE_DOC_LINK_CLASS,
                            })}
                        </article>
                    </div>
                </div>
            ) : null}
        </RoutePanel>
    );
}

function MarkdownTocNav(props: { items: MarkdownTocItem[] }): JSX.Element {
    return (
        <nav
            className="mb-8 lg:sticky lg:top-28 lg:mb-0"
            aria-label="On this page"
        >
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                On this page
            </p>
            <ul className="mt-2 space-y-1 border-l border-white/10 pl-3">
                {props.items.map((item) => (
                    <li
                        key={item.id}
                        className="list-none"
                        style={{
                            paddingLeft: `${Math.max(0, item.level - 2) * 0.65}rem`,
                        }}
                    >
                        <a
                            href={`#${item.id}`}
                            className="block py-0.5 text-sm leading-snug text-zinc-400 transition hover:text-zinc-100"
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
