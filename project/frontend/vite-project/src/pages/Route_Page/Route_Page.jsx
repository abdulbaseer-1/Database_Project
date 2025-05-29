import React from "react";

import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Route_Form from '../../components/Route_Form/Route_form.jsx';
function Route_Page({className}) {
    return(
        <div className={`${className}`}>
        <Header/>
        <Hero/>
        <main>
            <Route_Form/>
        </main>
        <Footer/>
        </div>
    )
}

export default Route_Page;