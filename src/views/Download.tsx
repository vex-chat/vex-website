import { Fragment } from "react";
import { ReleaseLinks, Hero, Footer } from "../components";

export function Download(): JSX.Element {
    return (
        <Fragment>
            <Hero content={<ReleaseLinks />} /> <Footer />
        </Fragment>
    );
}
