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
    faGavel,
    faLock,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ax from "axios";
import { useMemo, useState } from "react";
import { AssetsEntity, IRelease } from "../Release";
import { Hero } from "./Hero";

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
            case "deb":
                sorted[2] = file;
                break;
            case "AppImage":
                sorted[3] = file;
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

    useMemo(() => {
        const getFiles = async () => {
            try {
                const res = await ax.get(
                    "https://api.github.com/repos/vex-chat/vex-desktop/releases"
                );

                const releases = res.data;
                console.log(releases);

                for (const release of releases) {
                    if (releases[0].assets.length === 5) {
                        setRelease(release);
                        break;
                    }
                }
            } catch (err) {
                console.log("Forwarding to github releases page.");
                window.location.href =
                    "https://github.com/vex-chat/vex-desktop/releases";
            }
        };

        getFiles();
    }, []);

    if (!release || !release.assets) {
        return <span />;
    }

    return (
        <div className="container has-text-centered">
            <h1 className="title">vex desktop {release.tag_name}</h1>
            <div className="columns is-mobile is-centered">
                {sortAssets(release.assets).map((asset) => (
                    <div className="column is-narrow brand-link" key={asset.id}>
                        <FileIcon file={asset} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BulletPoints(): JSX.Element {
    return (
        <div className="panel-wrapper">
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
                <a href="https://github.com/vex-chat" target="__blank">
                    Open source.
                </a>{" "}
                Feel free to lend a hand.
            </p>
            <br />
        </div>
    );
}
