import React from "react";
import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import AboutUs from '../../components/About_us/About_us.jsx';


function Home({clasName}) {
    return(
        <div className={`${clasName}`}>
        <Header/>
        <Hero/>
        <AboutUs/>
        <main>
        </main>
        <Footer/>
        </div>
    )
}

export default Home;