import React from "react";
import { useSpring, animated } from "react-spring";
import "../stylesheets/style.sass";
import { DIVISOR } from "./constants";

const calc = (x: number, y: number) => [
    x - window.innerWidth / 2,
    y - window.innerHeight / 2,
];
const trans1 = (x: number, y: number) =>
    `translate3d(${x / 10 / DIVISOR}px,${y / 10 / DIVISOR}px,0)`;
const trans2 = (x: number, y: number) =>
    `translate3d(${x / 7.5 / DIVISOR}px,${y / 7.5 / DIVISOR}px,0)`;

export function Anim3(): JSX.Element {
    const [props, set] = useSpring(() => ({
        xy: [0, 0],
        config: { mass: 10, tension: 550, friction: 140 },
    }));
    return (
        <div
            className="animation-container"
            onMouseMove={({ clientX: x, clientY: y }) =>
                set({ xy: calc(x, y) })
            }
        >
            <animated.div
                className="card1"
                style={{ transform: props.xy.interpolate(trans1 as any) }}
            />
            <animated.div
                className="card2"
                style={{ transform: props.xy.interpolate(trans2 as any) }}
            />
            <animated.div className="card3" />
            <animated.div className="card4" />
        </div>
    );
}
