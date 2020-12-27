import React from "react";
import {
    faApple,
    faGithub,
    faLinux,
    faUbuntu,
    faWindows,
} from "@fortawesome/free-brands-svg-icons";
import { faCheck, faFile, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ax from "axios";
import { useMemo, useState } from "react";
import { AssetsEntity, IRelease } from "./Release";

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

function App() {
    const [release, setRelease] = useState(initialState);

    useMemo(() => {
        const getFiles = async () => {
            try {
                const res = await ax.get(
                    "https://api.github.com/repos/vex-chat/vex-desktop/releases/latest"
                );

                const release = res.data;
                console.log("length", release?.assets?.length);

                if (release?.assets?.length !== 5) {
                    window.location.href =
                        "https://github.com/vex-chat/vex-desktop/releases";
                } else {
                    const release = res.data;
                    setRelease(release);
                }

                // setFiles(files);
            } catch (err) {
                console.error(err);
            }
        };

        getFiles();
    }, []);

    if (release === null) {
        return <span />;
    }

    if (release?.assets) {
        release.assets = sortAssets(release.assets);
    }

    return (
        <div className="Aligner">
            <div className="Aligner-item Aligner-item--top" />
            <div className="Aligner-item">
                <div className="container is-family-monospace site scale-up-center">
                    <h1 className="title has-text-centered">vex messenger <span className="is-info tag">beta</span></h1>
                    <h2 className="subtitle has-text-centered">
                        encrypted group chat
                    </h2>

                    <p>
                        <span className="icon">
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="has-text-danger"
                            ></FontAwesomeIcon>
                        </span>
                        &nbsp;
                        We don't collect your data
                    </p>
                    <p>
                        <span className="icon">
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="has-text-danger"
                            ></FontAwesomeIcon>
                        </span>
                        &nbsp;
                        You don't need any info to sign up
                    </p>
                    <p>
                        <span className="icon">
                            <FontAwesomeIcon
                                icon={faLock}
                            ></FontAwesomeIcon>
                        </span>
                        &nbsp;
                        End to end encrypted
                    </p>
                    <p>
                        <span className="icon">
                            <FontAwesomeIcon
                                icon={faGithub}
                            ></FontAwesomeIcon>
                        </span>
                        &nbsp;&nbsp;
                       <a href="https://github.com/vex-chat" target="__blank">Open source</a>
                    </p>
                    <p>
                        <span className="icon">
                            <FontAwesomeIcon
                                icon={faCheck}
                                className="has-text-success"
                            ></FontAwesomeIcon>
                        </span>
                        &nbsp;
                        Based
                    </p>
                    <p>
                        <span className="icon">
                            <FontAwesomeIcon
                                icon={faCheck}
                                className="has-text-success"
                            ></FontAwesomeIcon>
                        </span>
                        &nbsp;
                        Redpilled
                    </p>

                    <br />
                    <div className="columns is-mobile is-centered">
                        {release?.assets?.map((asset) => (
                            <div className="column is-narrow" key={asset.id}>
                                <FileIcon file={asset} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="Aligner-item Aligner-item--bottom" />
        </div>
    );
}

export default App;
