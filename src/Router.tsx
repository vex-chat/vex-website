import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Download } from "./views/Download";
import { Home } from "./views/Home";

export function Router(): JSX.Element {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/"} render={() => <Home />} />
                <Route exact path={"/download"} render={() => <Download />} />
            </Switch>
        </BrowserRouter>
    );
}
