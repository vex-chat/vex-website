import { Component } from "react";

type State = {};

type Props = {
    children: any;
};

export class heading extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);

        console.log(props);

        this.state = {};
    }

    render() {
        return <h1 className="title">{this.props.children}</h1>;
    }
}
