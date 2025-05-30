import React from "react";

import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import BookForm from '../../components/Bus_Booking_form/Bus_Booking_form.jsx';
function Bookings({clasName}) {
    return(
        <div className={`${clasName}`}>
        <Header/>
        <Hero/>
        <BookForm/>
        <main>
        </main>
        <Footer/>
        </div>
    )
}

export default Bookings;