import React from "react";

import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import BookingsTable from "../../components/bookingsTable/bookingsTable.jsx";
import BusTable from '../../components/Table/Bus_Table.jsx';
import AllBookingsTable from "../../components/AllBookingsTable/AllBookingsTable.jsx";
import { UserContext } from "../../components/contexts/userContexts.jsx";
import { useContext } from "react";
function Bookings({clasName}) {
    const {role} = useContext(UserContext);

    return(
        <div className={`${clasName}`}>
        <Header/>
        <Hero/>
        <BookingsTable/>
        <BusTable/>
        {role==="admin" && <AllBookingsTable/>}
        <main>
        </main>
        <Footer/>
        </div>
    )
}

export default Bookings;