import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Footer, Hero, BulletPoints } from "../components";

export function Home(): JSX.Element {
    return (
        <div className="view">
            <Hero
                content={
                    <div className="content is-large  is-family-monospace">
                        <h1 className="title has-text-white">
                            vex messenger{" "}
                            <span className="is-light tag">beta</span>
                        </h1>
                        <h2 className="subtitle is-size-5">
                            encrypted group chat
                        </h2>
                        <Link
                            to="/download"
                            className="not-button has-text-white is-size-5"
                        >
                            download now{" "}
                            <span>
                                <FontAwesomeIcon icon={faLongArrowAltRight} />
                            </span>
                        </Link>
                    </div>
                }
            />
            <section className="has-background-light section">
                <div className="container">
                    <BulletPoints />
                </div>
            </section>
            <Footer />
        </div>
    );
}