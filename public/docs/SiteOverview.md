# Vex at a glance

**Private communications infrastructure** — your server, your keys, your stack.

Vex is an open source end-to-end encrypted messaging protocol. You deploy the reference server, integrate the TypeScript client, and run the stack yourself so no third party sits in the message path.

## Who this is for

- **Product and platform teams** integrating encrypted chat or machine-to-machine messaging without routing traffic through a vendor cloud.
- **Operators** who need a relay and policy surface they control: retention, export, and teardown follow **your** deployment and protocol settings, not a hosted console.
- **Evaluators** who want a straight line from marketing claims to repos, docs, and security policy.

## One stack, not two products

The protocol has a single wire format end to end. The site highlights two **reference implementations** that ship together:

- **Client library** — [`@vex-chat/libvex`](https://www.npmjs.com/package/@vex-chat/libvex) on npm, source at [`vex-protocol/libvex-js`](https://github.com/vex-protocol/libvex-js). Use it in apps, bots, and services that speak to your relay.
- **Reference server** — [`@vex-chat/spire`](https://www.npmjs.com/package/@vex-chat/spire) on npm, source at [`vex-protocol/spire`](https://github.com/vex-protocol/spire). Deploy it as the relay and persistence layer next to your clients.

The broader workspace (crypto, types, ops docs) lives in the [`vex-protocol`](https://github.com/vex-protocol/vex-protocol) monorepo.

## Install quickly

```bash
npm install @vex-chat/libvex
npm install @vex-chat/spire
```

Point clients at the Spire instance you run; keys stay with participants per the protocol design.

## Where to read next

- **Documentation** — [lib.vex.wtf](https://lib.vex.wtf/) (TypeScript client / integration).
- **Security** — [SECURITY.md](https://github.com/vex-protocol/vex-protocol/blob/master/SECURITY.md) in the monorepo for coordinated disclosure.
- **Licensing** — [Commercial licensing](/licensing) on this site; open source defaults are AGPL-oriented in the repos (see each package).
- **Privacy** — [Privacy policy](/privacy-policy), maintained as Markdown in a dedicated GitHub repo (same rendering pipeline as this page).
- **Status** — [Build and uptime-style status](/status).

## Relationship to this website

This page is **Markdown in the vex.wtf repo** (`public/docs/SiteOverview.md`), fetched by the browser and rendered with the same lightweight Markdown path as the privacy policy. Edit the file, merge, deploy — the overview updates with the site. For legal text that should live outside this repo, the privacy policy pattern (separate GitHub project + raw URL) still applies.

## Defense- or sector-specific packets

Higher-touch positioning (e.g. sector-specific capability packets) can live as separate Markdown or PDFs later, linked from here or from the homepage, without turning the public homepage into tactical copy.
