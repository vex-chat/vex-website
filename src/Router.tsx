/* eslint-disable jsx-a11y/anchor-is-valid */
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Download, Home, Invites, PrivacyPolicy } from "./views";

export interface IServer {
    serverID: string;
    name: string;
    icon?: string;
}

export interface IInvite {
    inviteID: string;
    serverID: string;
    owner: string;
    expiration: string;
}

export interface IUser {
    userID: string;
    username: string;
    lastSeen: Date;
    passwordHash: string;
    passwordSalt: string;
}

export function Router(): JSX.Element {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/"} render={() => <Home />} />
                <Route exact path={"/download"} render={() => <Download />} />
                <Route
                    exact
                    path={"/privacy-policy"}
                    render={() => <PrivacyPolicy />}
                />
                <Route
                    path={"/invite/:id"}
                    render={({ match }) => <Invites match={match} />}
                ></Route>
            </Switch>
        </BrowserRouter>
    );
}