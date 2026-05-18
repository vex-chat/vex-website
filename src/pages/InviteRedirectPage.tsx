import type { JSX } from "preact";

import { useEffect, useMemo, useState } from "preact/hooks";

import { RoutePanel } from "../components/RoutePanel";

const UUID_PATTERN =
    "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const INVITE_PATH_RE = new RegExp(`^/invite/(${UUID_PATTERN})/?$`, "i");

export function InviteRedirectPage(props: { path?: string }): JSX.Element {
    const inviteID = parseInviteID(props.path ?? window.location.pathname);
    const appLink = useMemo(
        () => (inviteID ? formatInviteAppLink(inviteID) : null),
        [inviteID]
    );
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!appLink) return;
        const timer = window.setTimeout(() => {
            window.location.href = appLink;
        }, 250);
        return () => window.clearTimeout(timer);
    }, [appLink]);

    const copyInvite = async () => {
        if (!inviteID || !navigator.clipboard) return;
        await navigator.clipboard.writeText(inviteID);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    if (!inviteID || !appLink) {
        return (
            <RoutePanel splotch="soft">
                <p className="text-xs uppercase tracking-[0.18em] text-[#ff6b6b]">
                    Invite
                </p>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                    Invalid invite link
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                    This invite URL is missing a valid invite code.
                </p>
                <p className="mt-6">
                    <a
                        href="/"
                        className="inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 no-underline transition-colors hover:border-white/25 hover:bg-white/10"
                    >
                        Back to Vex
                    </a>
                </p>
            </RoutePanel>
        );
    }

    return (
        <RoutePanel splotch="home">
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff6b6b]">
                Server invite
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                Opening Vex
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Your invite is ready. If Vex does not open automatically, use
                the button below.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                    href={appLink}
                    className="inline-flex rounded-lg border border-[#e70000]/50 bg-[#e70000]/20 px-4 py-3 text-sm font-semibold text-[#ff8a8a] no-underline transition-colors hover:border-[#e70000]/70 hover:bg-[#e70000]/30"
                >
                    Open in Vex
                </a>
                <button
                    type="button"
                    onClick={() => void copyInvite()}
                    className="inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 transition-colors hover:border-white/25 hover:bg-white/10"
                >
                    {copied ? "Copied" : "Copy invite code"}
                </button>
            </div>
            <p className="mt-6 font-mono text-xs text-zinc-500">{inviteID}</p>
        </RoutePanel>
    );
}

function formatInviteAppLink(inviteID: string): string {
    return `vex://invite/${inviteID}`;
}

function parseInviteID(path: string): null | string {
    return INVITE_PATH_RE.exec(path)?.[1] ?? null;
}
