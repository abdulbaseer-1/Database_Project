import React from "react";

import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import BookingsTable from "../../components/bookingsTable/bookingsTable.jsx";
import BusTable from '../../components/Table/Bus_Table.jsx';function Bookings({clasName}) {
    return(
        <div className={`${clasName}`}>
        <Header/>
        <Hero/>
        <BookingsTable/>
        <BusTable/>
        <main>
        </main>
        <Footer/>
        </div>
    )
}

export default Bookings;