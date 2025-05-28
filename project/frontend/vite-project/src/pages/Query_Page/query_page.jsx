import React from "react";

import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Query_db from "../../components/query_db/query_db.jsx";

function Query({clasName}) {
    return(
        <div className={`${clasName}`}>
        <Header/>
        <Hero/>
        <main>
            <Query_db /> {/* Component name must start with uppercase */}
        </main>
        <Footer/>
        </div>
    )
}

export default Query;