import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { BulletPoints } from "../components/ReleaseInfo";

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
                            hackable encrypted chat
                        </h2>
                        <a
                            href="/download"
                            className="not-button has-text-white is-size-5"
                        >
                            download now{" "}
                            <span>
                                <FontAwesomeIcon icon={faLongArrowAltRight} />
                            </span>
                        </a>
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
