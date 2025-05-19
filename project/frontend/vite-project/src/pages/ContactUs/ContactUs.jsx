import React from "react";

import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';

function Profile({clasName}) {
    return(
        <div className={`${clasName}`}>
        <Header/>
        <Hero/>
        <main>
        </main>
        <Footer/>
        </div>
    )
}

export default Profile;