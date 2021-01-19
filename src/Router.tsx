import axios from "axios";
import { useMemo, useState } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Download } from "./views/Download";
import { Home } from "./views/Home";
import { Avatar } from "./components/Avatar";

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
                    path={"/invite/:id"}
                    render={({ match }) => <InvitePage match={match} />}
                ></Route>
            </Switch>
        </BrowserRouter>
    );
}

export function InvitePage(props: { match: any }): JSX.Element {
    const [serverDetails, setServerDetails] = useState(null as IServer | null)
    const [inviteDetails, setInviteDetails] = useState(null as IInvite | null)
    const [inviterDetails, setInviterDetails] = useState(null as IUser | null)
    const [expired, setExpired] = useState(false);
    const [fetching, setFetching] = useState(true);

    useMemo(async () => {
        const inviteRes = await axios.put("https://api.vex.chat/invite/"+props.match.params.id)
        setInviteDetails(inviteRes.data);

        if (new Date(inviteRes.data.expiration).getTime() < Date.now()) {
            setExpired(true);
            setFetching(false);
            return;
        }

        const inviterRes = await axios.get("https://api.vex.chat/user/"+inviteRes.data.owner);
        setInviterDetails(inviterRes.data);

        const serverRes = await axios.get("https://api.vex.chat/server/"+inviteRes.data.serverID);
        setServerDetails(serverRes.data);
        setFetching(false);
    }, [props.match.params.id])

    if (fetching) {
        return <div className="view">
        <Hero content={<span />} 
        />
        <Footer />
    </div>
    }

    if (expired) {
        return <div className="view">
        <Hero content={
            <div>
                <h1 className="title">Uh oh, that invite's expired.</h1>
                <p>Ask your friend for a new one.</p>
            </div>} 
        />
        <Footer />
    </div>
    }

    return (
        <div className="view">
            <Hero content={
                <div>
                    <h1 className="title">Lucky you, you're invited.</h1>

                    <div className="columns">
                        <div className="column is-narrow">
                            {inviterDetails && <Avatar hash={Date.now()} user={inviterDetails} />}
                        </div>
                        <div className="column is-narrow">
                            {inviterDetails && inviterDetails.username} has invited you to <strong className="has-text-white">{serverDetails?.name || ""}</strong>
                        </div>
                    </div>

                    <button className="button" onClick={() => {window.open("vex://"+inviteDetails?.inviteID)}}>Join</button>
                </div>} 
            />
            <Footer />
        </div>
    );
}
