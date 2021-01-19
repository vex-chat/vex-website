import React, { Fragment, useState } from "react";
import logo from "../assets/icon.svg";

export function Hero(props: { content: JSX.Element }): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <Fragment>
            <header className="navbar">
                <div className="container">
                    <div className="navbar-brand">
                        <a href="/" className="navbar-item">
                            <img className="logo" src={logo} alt={"logo"} />
                            &nbsp;vex
                        </a>
                        <span
                            className={`navbar-burger burger ${
                                menuOpen ? "is-active" : ""
                            }`}
                            onClick={() => {
                                setMenuOpen(!menuOpen);
                            }}
                            data-target="navbarMenuHeroC"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </div>
                    <div
                        id="navbarMenuHeroC"
                        className={`navbar-menu ${menuOpen ? "is-active" : ""}`}
                    >
                        <div className="navbar-end">
                            <a className="navbar-item" href="/privacy-policy">
                                Privacy Policy
                            </a>
                            <span className="navbar-item">
                                <a className="button is-link" href="/download">
                                    <span>Download</span>
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <section className="hero is-large is-black" id="home">
                <div className="hero-head"></div>

                <div className="hero-body">
                    <div className="container">{props.content}</div>
                </div>
            </section>
        </Fragment>
    );
}
