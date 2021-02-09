import React from "react";
import logo from "../images/vex-logo.svg";

// Import icons
import conversation from "../images/conversation.svg";
import secure from "../images/secure.svg";
import privacy from "../images/private.svg";

// Import parallax illustrations
import { Anim1 } from "../components/anim1";
import { Anim2 } from "../components/anim2";
import { Anim3 } from "../components/anim3";
import { Navbar } from "../components/Hero";
import { useHistory } from "react-router-dom";

export function Home() {
    const history = useHistory();

    return (
        <div className="app container">
            <Navbar />
            <section className="section hero is-fullheight" id="hero">
                <div className="hero-body">
                    <div className="columns container has-text-left ">
                        <div className="column is-half">
                            <Anim1 />
                        </div>
                        <div className="column is-half content">
                            <img src={logo} width="192" alt={"logo"} />
                            <h2 className="title is-spaced is-2">
                                Secure. Private. Encrypted.
                            </h2>
                            <p className="subtitle is-4">
                                Simple privacy and powerful end to end
                                encryption technology for communication.
                                Real-time messaging with large groups of people
                                or chatting with your friends without
                                compromising your privacy.
                            </p>
                            <button
                                onClick={() => {
                                    history.push("/download");
                                }}
                                className="button is-medium is-primary is-rounded"
                            >
                                Download Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="about">
                <div className="columns container has-text-left is-vcentered">
                    <div className="column is-half">
                        <div className="container showcase">
                            <img
                                className=""
                                src="https://picsum.photos/1920/1080"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="column is-half content">
                        <h2 className="title">
                            Private and secure messaging for everyone,
                            everywhere.
                        </h2>
                        <p className="subtitle">
                            Vex Chat is a secure instant messaging platform for
                            social and commercial use. A private place to share
                            ideas that protects your identity and keeps you in
                            control.
                        </p>
                        <button
                            onClick={() => {
                                history.push("/download");
                            }}
                            className="button is-medium is-primary is-rounded"
                        >
                            Download Now
                        </button>
                    </div>
                </div>
            </section>

            <section className="section" id="features">
                <div className="columns container has-text-left">
                    <div className="column is-half content">
                        <div className="media">
                            <figure className="media-left">
                                <p className="image is-64x64">
                                    <img src={conversation} alt={"Icon"} />
                                </p>
                            </figure>
                            <div className="media-content">
                                <div className="content">
                                    <h2 className="">Your conversation</h2>
                                    <p className="subtitle">
                                        Vex is open-source, encrypted and free.
                                        It connects you securely to any other
                                        Vex user, anywhere in the world
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="media">
                            <figure className="media-left">
                                <p className="image is-64x64">
                                    <img src={secure} alt={"Icon"} />
                                </p>
                            </figure>
                            <div className="media-content">
                                <div className="content">
                                    <h2 className="">Free of censorship</h2>
                                    <p className="subtitle">
                                        Your messages are end to end encrypted,
                                        meaning we couldn't even read them if we
                                        wanted to.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="media">
                            <figure className="media-left">
                                <p className="image is-64x64">
                                    <img src={privacy} alt={"Icon"} />
                                </p>
                            </figure>
                            <div className="media-content">
                                <div className="content">
                                    <h2 className="">No surveillance</h2>
                                    <p className="subtitle">
                                        We collect as little data as possible to
                                        provide you with chat service. We don't
                                        spy on you or collect data for profit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <Anim3 />
                    </div>
                </div>
            </section>

            <section className="section" id="progress">
                <div className="columns container has-text-left">
                    <div className="column block is-half content">
                        <h2 className="title is-spaced">
                            We need your feedback
                        </h2>
                        <p className="subtitle">
                            We hate boring instant messaging apps just as much
                            as you do, so we've built an app that looks and
                            feels like your favorite chat platform.
                        </p>
                        <p className="subtitle">
                            Now that we're finished with the final touches,
                            we're launching on Kickstarter to get your feedback,
                            input, and see if you want to support us!
                        </p>
                        <div className="project-progress">
                            <div className="completion">
                                <h3 className="title is-1">$50,000</h3>
                                <p>Collected</p>
                            </div>
                            <progress
                                className="progress is-primary"
                                value="15"
                                max="100"
                            >
                                15%
                            </progress>
                            <nav className="level">
                                <div className="level-item has-text-centered">
                                    <div>
                                        <p className="title">15%</p>
                                        <p className="heading">Funded</p>
                                    </div>
                                </div>
                                <div className="level-item has-text-centered">
                                    <div>
                                        <p className="title">$50k</p>
                                        <p className="heading">Goal</p>
                                    </div>
                                </div>
                                <div className="level-item has-text-centered">
                                    <div>
                                        <p className="title">21</p>
                                        <p className="heading">Days left</p>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                    <div className="column is-half">
                        <Anim2 />
                    </div>
                </div>
                <div className="cta">
                    <button className="button is-medium is-primary is-rounded">
                        Support vex
                    </button>
                </div>
            </section>
        </div>
    );
}
