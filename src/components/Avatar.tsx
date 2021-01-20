import { Component } from "react";
import { IUser } from "../Router";
import { strToIcon } from "../utils";

type Props = {
    user: IUser;
    className?: string;
    size?: number;
    hash: number;
};

type State = {
    src: string;
    loaded: boolean;
};

export class Avatar extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            src: strToIcon(this.props.user.username), // "https://api.vex.chat/avatar/" + props.user.userID,
            loaded: false,
        };
    }

    componentDidMount() {
        this.setState({
            src: "https://api.vex.chat/avatar/" + this.props.user.userID,
        });
    }

    onError(): void {
        this.setState({
            src: strToIcon(this.props.user.username),
        });
    }

    render(): JSX.Element {
        const { src } = this.state;
        const size = this.props.size || 48;

        return (
            <span className="image">
                <img
                    alt={`${this.props.user.username}'s avatar`}
                    className={`image is-${size.toString()}x${size.toString()} is-rounded ${
                        this.props.className || ""
                    } ${this.state.loaded ? "" : "hidden"}`}
                    src={src + "?hash=" + this.props.hash.toString()}
                    onError={this.onError.bind(this)}
                    onLoad={() => {
                        this.setState({ loaded: true });
                    }}
                />
            </span>
        );
    }
}
