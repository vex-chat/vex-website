import {
    faApple,
    faLinux,
    faUbuntu,
    faWindows,
} from "@fortawesome/free-brands-svg-icons";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ax from "axios";
import { useMemo, useState } from "react";

interface IFile {
    name: string;
    type: string;
    mtime: string;
    size: number;
}

const initialState: IFile[] = [];

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

export function FileIcon(props: { file: IFile }): JSX.Element {
    const extension = nameToExt(props.file.name);

    if (extension === "txt") {
        return <span />;
    }

    return (
        <a href={"https://release.vex.chat/" + props.file.name}>
            <div className="brand-icon">{getFileIcon(extension)}</div>
        </a>
    );
}

function App() {
    const [files, setFiles] = useState(initialState);

    const getFiles = async () => {
        try {
            const res = await ax.get("https://release.vex.chat/");
            const files = res.data;
            setFiles(files);
        } catch (err) {
            console.error(err);
        }
    };

    useMemo(() => {
        getFiles();
    }, []);

    return (
        <div className="Aligner">
            <div className="Aligner-item Aligner-item--top" />
            <div className="Aligner-item">
                <div className="container is-family-monospace site">
                    <h1 className="title">vex messenger</h1>
                    <h2 className="subtitle">encrypted group chat</h2>
                    <div className="columns">
                        {files.map((file: any) => (
                            <div
                                key={file.name}
                                className="column is-narrow has-text-left"
                            >
                                <FileIcon file={file} />
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
