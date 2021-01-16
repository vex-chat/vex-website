import { Fragment } from "react";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { ReleaseLinks } from "../components/ReleaseInfo";

export function Download(): JSX.Element {
    return (
        <Fragment>
            <Hero content={<ReleaseLinks />} /> <Footer />
        </Fragment>
    );
}
