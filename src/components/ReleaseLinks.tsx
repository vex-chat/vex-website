import React from "react";
import {
    faApple,
    faGithub,
    faLinux,
    faUbuntu,
    faWindows,
} from "@fortawesome/free-brands-svg-icons";
import {
    faBalanceScale,
    faCheck,
    faFile,
    faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ax from "axios";
import { useEffect, useState } from "react";
import { AssetsEntity, IRelease } from "../Release";
import { GITHUB_ENDPOINTS, GITHUB_REPOS, GITHUB_WEB_URLS } from "./constants";

const getFileIcon = (extension: string) => {
    switch (extension) {
        case "exe":
            return <FontAwesomeIcon icon={faWindows} />;
        case "AppImage":
            return <FontAwesomeIcon icon={faLinux} />;
        case "deb":
            return <FontAwesomeIcon icon={faUbuntu} />;
        case "dmg":
            return <FontAwesomeIcon icon={faApple} />;
        default:
            return <FontAwesomeIcon icon={faFile} />;
    }
};

const nameToExt = (name: string) => {
    const parts = name.split(".");
    const extension = parts[parts.length - 1];
    return extension;
};

function sortAssets(list: AssetsEntity[]) {
    const sorted = new Array(4);
    for (const file of list) {
        switch (nameToExt(file.name)) {
            case "exe":
                sorted[0] = file;
                break;
            case "dmg":
                sorted[1] = file;
                break;
            case "AppImage":
                sorted[3] = file;
                break;
        }
    }
    return sorted as AssetsEntity[];
}

export function FileIcon(props: { file: AssetsEntity }): JSX.Element {
    const extension = nameToExt(props.file.name);

    return (
        <a href={props.file.browser_download_url}>
            <div className="brand-icon">{getFileIcon(extension)}</div>
        </a>
    );
}

const initialState: IRelease | null = null;

export function ReleaseLinks() {
    const [release, setRelease] = useState(initialState);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const getFiles = async () => {
            try {
                const res = await ax.get(
                    GITHUB_ENDPOINTS.RELEASES(GITHUB_REPOS.VEX_DESKTOP)
                );
                const releases = res.data;
                // Get the latest non-draft, non-prerelease release
                // If no such release exists, fall back to the first release
                let found = false;
                for (const release of releases) {
                    if (!release.draft && !release.prerelease) {
                        setRelease(release);
                        found = true;
                        break;
                    }
                }
                // If no stable release found, use the first release (might be prerelease)
                if (!found && releases.length > 0) {
                    setRelease(releases[0]);
                    found = true;
                }
                if (!found) {
                    setFailed(true);
                }
            } catch (err) {
                console.warn("Fetch failed.", err);
                setFailed(true);
            }
        };

        getFiles();
    }, []);

    console.log(release);

    if (failed) {
        return (
            <span>
                <div className="container has-text-centered">
                    <h1 className="title">vex desktop</h1>
                    <div className="columns is-mobile is-centered">
                        <div className="column is-narrow brand-link">
                            <a
                                href={GITHUB_WEB_URLS.VEX_DESKTOP_RELEASES}
                                rel="noreferrer"
                                target="_blank"
                            >
                                Click here to go to download page
                            </a>
                        </div>
                    </div>
                    <a href={GITHUB_WEB_URLS.VEX_DESKTOP}>source code</a>
                </div>
            </span>
        );
    }

    return (
        <div className="container has-text-centered">
            <h1 className="title">
                {release && "vex desktop"} {release?.tag_name}
            </h1>
            <div className="columns is-mobile is-centered">
                {sortAssets(release?.assets || []).map((asset) => (
                    <div className="column is-narrow is-size-1" key={asset.id}>
                        <FileIcon file={asset} />
                    </div>
                ))}
            </div>
            <a
                target="_blank"
                rel="noreferrer"
                href={GITHUB_WEB_URLS.VEX_DESKTOP}
            >
                source code
            </a>
            <br />
            <a
                target="_blank"
                rel="noreferrer"
                href={release?.html_url || GITHUB_WEB_URLS.VEX_DESKTOP_RELEASES}
            >
                alternative downloads
            </a>
        </div>
    );
}

export function BulletPoints(): JSX.Element {
    return (
        <div className="panel-wrapper container">
            <p>
                <span className="icon">
                    <FontAwesomeIcon
                        icon={faCheck}
                        className="has-text-success"
                    ></FontAwesomeIcon>
                </span>
                &nbsp; We collect as little data from you as possible.
            </p>
            <p>
                <span className="icon">
                    <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
                </span>
                &nbsp; End to end encrypted. Your messages can't be read by us.
            </p>
            <p>
                <span className="icon">
                    <FontAwesomeIcon icon={faBalanceScale}></FontAwesomeIcon>
                </span>
                &nbsp; Supports your right to{" "}
                <a
                    target={"__blank"}
                    rel={"noopener noreferrer"}
                    href="https://constitution.congress.gov/browse/essay/amdt1_4_1/"
                >
                    peacefully assemble and communicate
                </a>
                .
            </p>
            <p>
                <span className="icon">
                    <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
                </span>
                &nbsp;&nbsp;
                <a href={GITHUB_WEB_URLS.VEX_CHAT_ORG} target="__blank">
                    Open source.
                </a>{" "}
                Feel free to lend a hand.
            </p>
            <br />
        </div>
    );
}
