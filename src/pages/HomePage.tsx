import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { RoutePanel } from "../components/RoutePanel";
import {
    CheckCircle2Icon,
    GithubIcon,
    LoaderCircleIcon,
    PackageIcon,
    ServerIcon,
    XCircleIcon,
} from "../components/Icons";
import { formatRelativeTime } from "../lib/relativeTime";

type NpmPackageResponse = {
    "dist-tags"?: Record<string, string>;
    time?: Record<string, string>;
};

type GitHubWorkflowRunsResponse = {
    workflow_runs?: Array<{
        status: string;
        conclusion: string | null;
        html_url: string;
        updated_at: string;
    }>;
};

type GitHubCommitApiResponse = {
    sha: string;
    html_url: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    author: {
        login: string;
        avatar_url: string;
        html_url: string;
    } | null;
};

type LibvexMeta = {
    rcVersion: string;
    latestVersion: string;
    publishedAt: string;
    buildStatus: string;
    buildUpdatedAt: string;
    buildUrl: string;
    latestCommit: {
        sha: string;
        message: string;
        date: string;
        url: string;
        authorName: string;
        authorLogin: string | null;
        authorAvatarUrl: string | null;
        authorUrl: string | null;
    } | null;
};

/** Latest Spire repo head + npm version for the home pillar. */
type SpireHeadMeta = {
    buildStatus: string;
    buildUrl: string;
    latestCommit: LibvexMeta["latestCommit"];
    latestVersion: string | null;
};

const NPM_PACKAGE_URL = "https://registry.npmjs.org/@vex-chat/libvex";
const SPIRE_NPM_PACKAGE_URL = "https://registry.npmjs.org/@vex-chat/spire";
/** Cached GitHub metadata via `api/gh/public/*` (see `api/lib/githubPublicCache.ts`). */
const LIBVEX_GITHUB_API_URL = "/api/gh/public/libvex-github";
const SPIRE_GITHUB_API_URL = "/api/gh/public/spire-github";
const LIBVEX_NPM_URL = "https://www.npmjs.com/package/@vex-chat/libvex";
const SPIRE_NPM_URL = "https://www.npmjs.com/package/@vex-chat/spire";
const LIBVEX_REPO_URL = "https://github.com/vex-protocol/libvex-js";
const SPIRE_REPO_URL = "https://github.com/vex-protocol/spire";

const PILLAR_HEADING_CLASS =
    "mt-2.5 text-base font-semibold tracking-tight text-zinc-50 sm:text-lg";

function PillarPackageRepoLink(props: {
    href: string;
    packageLabel: string;
    accent: "client" | "server";
}): JSX.Element {
    const hover =
        props.accent === "client"
            ? "hover:text-[#6ee7c5] hover:decoration-[#00b887]/55"
            : "hover:text-[#fecaca] hover:decoration-[#e70000]/50";
    return (
        <a
            href={props.href}
            target="_blank"
            rel="noreferrer"
            className={`mt-1 inline-flex w-fit max-w-full items-center gap-1.5 rounded font-mono text-[0.8125rem] text-zinc-400 underline decoration-zinc-600 decoration-1 underline-offset-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${hover}`}
        >
            <GithubIcon
                className="h-3.5 w-3.5 shrink-0 opacity-65"
                aria-hidden
            />
            {props.packageLabel}
        </a>
    );
}

function truncateCommitMessage(message: string, maxLength = 42): string {
    const singleLine = message.replace(/\s+/g, " ").trim();
    if (singleLine.length <= maxLength) return singleLine;
    return `${singleLine.slice(0, maxLength - 1)}…`;
}

function getBuildState(
    status: string
): "passing" | "failing" | "running" | "unknown" {
    const normalized = status.toLowerCase();
    if (normalized.includes("success")) return "passing";
    if (normalized.includes("failure") || normalized.includes("cancelled"))
        return "failing";
    if (normalized.includes("in_progress") || normalized.includes("queued"))
        return "running";
    return "unknown";
}

function VersionPill(props: { value: string; href?: string }): JSX.Element {
    const node = (
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-mono text-zinc-200">
            v{props.value}
        </span>
    );
    if (!props.href) return node;
    return (
        <a
            href={props.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
            title={`Open version v${props.value}`}
        >
            {node}
        </a>
    );
}

function BuildCommitPill(props: {
    status: string;
    buildHref?: string;
    commit: {
        sha: string;
        message: string;
        date: string;
        url: string;
        authorName: string;
        authorLogin: string | null;
        authorAvatarUrl: string | null;
        authorUrl: string | null;
    };
    maxMessageLength?: number;
}): JSX.Element {
    const { status, buildHref, commit } = props;
    const state = getBuildState(status);
    const label = commit.authorLogin ?? commit.authorName;
    const shortSha = commit.sha.slice(0, 7);
    const message = truncateCommitMessage(
        commit.message,
        props.maxMessageLength ?? 30
    );
    const toneClasses =
        state === "passing"
            ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
            : state === "failing"
            ? "border-red-500/35 bg-red-500/10 text-red-200"
            : state === "running"
            ? "border-amber-500/35 bg-amber-500/10 text-amber-200"
            : "border-white/20 bg-white/5 text-zinc-300";

    return (
        <a
            href={buildHref ?? commit.url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex max-w-[19.375rem] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] transition-colors hover:brightness-110 sm:max-w-[26.875rem] ${toneClasses}`}
            title={`${commit.message} · ${label} · ${formatRelativeTime(
                commit.date
            )}`}
        >
            {state === "passing" ? (
                <CheckCircle2Icon className="h-3.5 w-3.5 shrink-0" />
            ) : state === "failing" ? (
                <XCircleIcon className="h-3.5 w-3.5 shrink-0" />
            ) : state === "running" ? (
                <LoaderCircleIcon className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : (
                <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
            )}
            <span className="shrink-0 font-mono text-[0.75rem] font-thin leading-none">
                {shortSha}
            </span>
            <span className="max-w-[14ch] truncate text-[0.75rem] font-semibold leading-none text-zinc-100 sm:max-w-[20ch]">
                {message}
            </span>
            <span className="shrink-0 text-[0.625rem] text-zinc-400/80">
                {label}
            </span>
            {commit.authorAvatarUrl ? (
                <img
                    src={commit.authorAvatarUrl}
                    alt={`${label} avatar`}
                    className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-white/20"
                />
            ) : (
                <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-white/20" />
            )}
        </a>
    );
}

const PILLAR_CARD_CLASS =
    "group relative flex h-full flex-col rounded-xl border border-white/10 bg-zinc-950/90 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:border-white/18 sm:p-4";

function StackPillars(props: {
    libvexMeta: LibvexMeta | null;
    spireMeta: SpireHeadMeta | null;
}): JSX.Element {
    const { libvexMeta, spireMeta } = props;
    return (
        <section
            className="mt-10"
            aria-labelledby="vex-reference-stack-heading"
        >
            <h2
                id="vex-reference-stack-heading"
                className="text-base font-semibold tracking-tight text-zinc-200 sm:text-lg"
            >
                Reference implementations
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-400">
                One protocol end to end: integrate the client library, run the
                server on your infrastructure, and operate a single stack you
                own.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                    className={`${PILLAR_CARD_CLASS} ring-1 ring-[#00b887]/[0.12] hover:border-white/18`}
                >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#00b887]/30 bg-[#00b887]/10 text-[#6ee7c5]">
                        <PackageIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className={PILLAR_HEADING_CLASS}>Client library</h3>
                    <PillarPackageRepoLink
                        href={LIBVEX_REPO_URL}
                        packageLabel="@vex-chat/libvex"
                        accent="client"
                    />
                    <p className="mt-2 flex-1 text-sm leading-snug text-zinc-400">
                        TypeScript client for apps, bots, and services that
                        speak the protocol to your relay.
                    </p>
                    {libvexMeta ? (
                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-white/[0.06] pt-3">
                            <VersionPill
                                value={libvexMeta.latestVersion}
                                href={LIBVEX_NPM_URL}
                            />
                            {libvexMeta.latestCommit ? (
                                <BuildCommitPill
                                    status={libvexMeta.buildStatus}
                                    buildHref={libvexMeta.buildUrl}
                                    commit={libvexMeta.latestCommit}
                                    maxMessageLength={28}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <div
                    className={`${PILLAR_CARD_CLASS} ring-1 ring-[#e70000]/[0.12] hover:border-white/18`}
                >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e70000]/30 bg-[#e70000]/10 text-[#fca5a5]">
                        <ServerIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className={PILLAR_HEADING_CLASS}>Reference server</h3>
                    <PillarPackageRepoLink
                        href={SPIRE_REPO_URL}
                        packageLabel="@vex-chat/spire"
                        accent="server"
                    />
                    <p className="mt-2 flex-1 text-sm leading-snug text-zinc-400">
                        Reference relay and persistence layer you deploy
                        alongside the client—same protocol, your keys, your
                        policy surface.
                    </p>
                    {spireMeta &&
                    (spireMeta.latestVersion || spireMeta.latestCommit) ? (
                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-white/[0.06] pt-3">
                            {spireMeta.latestVersion ? (
                                <VersionPill
                                    value={spireMeta.latestVersion}
                                    href={SPIRE_NPM_URL}
                                />
                            ) : null}
                            {spireMeta.latestCommit ? (
                                <BuildCommitPill
                                    status={spireMeta.buildStatus}
                                    buildHref={spireMeta.buildUrl}
                                    commit={spireMeta.latestCommit}
                                    maxMessageLength={28}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

function HomeInstallHint(): JSX.Element {
    return (
        <div className="mt-5 max-w-2xl rounded-lg border border-white/10 bg-zinc-950/70 px-4 py-3">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Install from npm
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                Client:{" "}
                <a
                    href={LIBVEX_NPM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[0.8125rem] text-[#6ee7c5] underline decoration-[#00b887]/45 underline-offset-2 hover:text-[#a7f3d0]"
                >
                    npm install @vex-chat/libvex
                </a>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                Reference server package:{" "}
                <a
                    href={SPIRE_NPM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[0.8125rem] text-[#fca5a5] underline decoration-[#e70000]/40 underline-offset-2 hover:text-[#fecaca]"
                >
                    npm install @vex-chat/spire
                </a>
                <span className="text-zinc-500">
                    {" "}
                    · server source:{" "}
                    <a
                        href={SPIRE_REPO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-200"
                    >
                        github.com/vex-protocol/spire
                    </a>
                </span>
            </p>
        </div>
    );
}

export function HomePage(_: { path?: string; default?: boolean }): JSX.Element {
    const [libvexMeta, setLibvexMeta] = useState<LibvexMeta | null>(null);
    const [spireMeta, setSpireMeta] = useState<SpireHeadMeta | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadStackHeads() {
            try {
                const [
                    npmResponse,
                    libvexGhResponse,
                    spireGhResponse,
                    spireNpmResponse,
                ] = await Promise.all([
                    fetch(NPM_PACKAGE_URL),
                    fetch(LIBVEX_GITHUB_API_URL),
                    fetch(SPIRE_GITHUB_API_URL),
                    fetch(SPIRE_NPM_PACKAGE_URL),
                ]);

                let spireLatestVersion: string | null = null;
                if (!cancelled && spireNpmResponse.ok) {
                    try {
                        const spireNpmJson =
                            (await spireNpmResponse.json()) as NpmPackageResponse;
                        const v =
                            spireNpmJson["dist-tags"]?.latest?.trim() ?? "";
                        if (v.length > 0 && v !== "n/a") {
                            spireLatestVersion = v;
                        }
                    } catch {
                        // ignore npm parse errors
                    }
                }

                if (!cancelled && npmResponse.ok && libvexGhResponse.ok) {
                    const npmData =
                        (await npmResponse.json()) as NpmPackageResponse;
                    const ghJson = (await libvexGhResponse.json()) as {
                        runs: GitHubWorkflowRunsResponse;
                        commits: GitHubCommitApiResponse[];
                    };
                    const runsData = ghJson.runs;
                    const commitsData = ghJson.commits;
                    const latestRun = runsData.workflow_runs?.[0];
                    const latestCommit = commitsData[0];
                    const rcVersion = npmData["dist-tags"]?.rc ?? "n/a";
                    const latestVersion = npmData["dist-tags"]?.latest ?? "n/a";
                    const publishedAt = npmData.time?.[rcVersion] ?? "";

                    setLibvexMeta({
                        rcVersion,
                        latestVersion,
                        publishedAt,
                        buildStatus: latestRun
                            ? `${latestRun.status}${
                                  latestRun.conclusion
                                      ? ` / ${latestRun.conclusion}`
                                      : ""
                              }`
                            : "unknown",
                        buildUpdatedAt: latestRun?.updated_at ?? "",
                        buildUrl: latestRun?.html_url ?? "",
                        latestCommit: latestCommit
                            ? {
                                  sha: latestCommit.sha.slice(0, 12),
                                  message: latestCommit.commit.message,
                                  date: latestCommit.commit.author.date,
                                  url: latestCommit.html_url,
                                  authorName: latestCommit.commit.author.name,
                                  authorLogin:
                                      latestCommit.author?.login ?? null,
                                  authorAvatarUrl:
                                      latestCommit.author?.avatar_url ?? null,
                                  authorUrl:
                                      latestCommit.author?.html_url ?? null,
                              }
                            : null,
                    });
                }

                if (!cancelled && spireGhResponse.ok) {
                    const ghJson = (await spireGhResponse.json()) as {
                        runs: GitHubWorkflowRunsResponse;
                        commits: GitHubCommitApiResponse[];
                    };
                    const latestRun = ghJson.runs.workflow_runs?.[0];
                    const latestCommit = ghJson.commits[0];
                    setSpireMeta({
                        buildStatus: latestRun
                            ? `${latestRun.status}${
                                  latestRun.conclusion
                                      ? ` / ${latestRun.conclusion}`
                                      : ""
                              }`
                            : "unknown",
                        buildUrl: latestRun?.html_url ?? "",
                        latestCommit: latestCommit
                            ? {
                                  sha: latestCommit.sha.slice(0, 12),
                                  message: latestCommit.commit.message,
                                  date: latestCommit.commit.author.date,
                                  url: latestCommit.html_url,
                                  authorName: latestCommit.commit.author.name,
                                  authorLogin:
                                      latestCommit.author?.login ?? null,
                                  authorAvatarUrl:
                                      latestCommit.author?.avatar_url ?? null,
                                  authorUrl:
                                      latestCommit.author?.html_url ?? null,
                              }
                            : null,
                        latestVersion: spireLatestVersion,
                    });
                }
            } catch {
                // silent fallback to static view
            }
        }

        void loadStackHeads();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <RoutePanel splotch="home">
            <h1 className="mt-0 max-w-4xl text-balance text-3xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
                Private communications infrastructure.
            </h1>
            <p className="mt-4 max-w-3xl text-lg font-semibold tracking-tight text-zinc-200 sm:text-xl">
                Your server. Your keys. Your stack.
            </p>
            <p className="hero-lede mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
                Vex is an open source end-to-end encrypted messaging protocol.
                Deploy the reference server, integrate the client library, and
                own your communications stack with no third party in the loop.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
                Retention, export, and teardown follow your deployment policies
                and protocol settings—not a vendor-hosted control plane.
            </p>
            <HomeInstallHint />
            <StackPillars libvexMeta={libvexMeta} spireMeta={spireMeta} />
        </RoutePanel>
    );
}
