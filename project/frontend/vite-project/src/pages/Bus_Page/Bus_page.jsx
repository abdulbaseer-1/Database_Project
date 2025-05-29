import React from "react";

import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Buses from '../../components/Bus_Form/Bus_form.jsx';

function Bus_Page({className}) {
    return(
        <div className={`${className}`}>
        <Header/>
        <Hero/>
        <main>
            <Buses/>
        </main>
        <Footer/>
        </div>
    )
}

export default Bus_Page;