import React, { useState, useEffect, useRef } from "react";
import bus from '../../assets/icons/bus cartoon vitage.jpg';
import hero_style from './Hero.module.css';


function Hero({ className, children }) {
    const heroImages = [bus];
    const heroMessages = ["hello"];

    const [hero, setHero] = useState(0);
    const [message, setMessage] = useState(0);

    let interval = useRef(null);

    const startInterval = () => {
        interval.current = setInterval(() => {
            setHero((prevState) => (prevState + 1) % heroImages.length);
            setMessage((prevState) => (prevState + 1) % heroMessages.length);
        }, 10000);
    };

    const resetInterval = () => {
        if (interval.current) {
            clearInterval(interval.current);
            interval.current = null;
        }
    };

    useEffect(() => {
        startInterval();
        return () => resetInterval();
    }, [heroImages.length, heroMessages.length]); // Dependencies for when the image or message arrays change

    const next_hero = () => {
        resetInterval();
        setHero((prevState) => (prevState + 1) % heroImages.length);
        setMessage((prevState) => (prevState + 1) % heroMessages.length);
        startInterval();
    };

    const prev_hero = () => {
        resetInterval();
        setHero((prevState) => (prevState === 0 ? heroImages.length - 1 : prevState - 1));
        setMessage((prevState) => (prevState === 0 ? heroMessages.length - 1 : prevState - 1));
        startInterval();
    };

    return (
        <div className={`${hero_style.hero} ${className}`}>
            <button className={hero_style.prev_btn} onClick={prev_hero}>&#60;</button>
            <div>{React.createElement(heroMessages[message])}</div> {/*syntax for creating react elemnt in the dom*/}
            <img src={heroImages[hero]} alt="Hero" />
            <button className={hero_style.next_btn} onClick={next_hero}>&#62;</button>
        </div>
    );
}

export default Hero;
