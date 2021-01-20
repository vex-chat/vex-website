import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icon.svg";

export function Hero(props: { content: JSX.Element }): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <Fragment>
            <header className="navbar">
                <div className="container">
                    <div className="navbar-brand">
                        <Link
                            to={"/"}
                            className="logo-link navbar-item is-size-1 is-family-monospace"
                        >
                            <img className="logo" src={logo} alt={"logo"} />
                            &nbsp;vex
                        </Link>
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
                            <Link className="navbar-item" to="/privacy-policy">
                                Privacy Policy
                            </Link>
                            <span className="navbar-item">
                                <Link className="button is-link" to="/download">
                                    <span>Download</span>
                                </Link>
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
