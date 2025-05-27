import React, { useState, useEffect, useRef } from "react";
import bus from '../../assets/icons/pexels-igor-starkov-233202-1224762.jpg';
import bus1 from '../../assets/icons/pexels-jimbear-1426516.jpg';
import bus2 from '../../assets/icons/pexels-sevenstormphotography-575897.jpg';
import hero_style from './Hero.module.css';

function Hero({ className, children }) {
    const heroImages = [bus, bus1, bus2];

    const [hero, setHero] = useState(0);

    let interval = useRef(null);

    const startInterval = () => {
        interval.current = setInterval(() => {
            setHero((prevState) => (prevState + 1) % heroImages.length);
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
    }, [heroImages.length]);

    const next_hero = () => {
        resetInterval();
        setHero((prevState) => (prevState + 1) % heroImages.length);
        startInterval();
    };

    const prev_hero = () => {
        resetInterval();
        setHero((prevState) => (prevState === 0 ? heroImages.length - 1 : prevState - 1));
        startInterval();
    };

    return (
        <div className={`${hero_style.hero} ${className}`}>
            <button className={hero_style.prev_btn} onClick={prev_hero}>&#60;</button>
            <img src={heroImages[hero]} alt={`Hero ${hero + 1}`} />
            <button className={hero_style.next_btn} onClick={next_hero}>&#62;</button>
        </div>
    );
}

export default Hero;
