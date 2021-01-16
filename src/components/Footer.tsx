import React, { Fragment } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/icon.svg";

export function Footer(): JSX.Element {
    return (
        <section className="section" id="footer-bottom">
            <div className="content has-text-right">
                <p>© 2020 LogicBite LLC. All rights reserved.</p>
            </div>
        </section>
    );
}
