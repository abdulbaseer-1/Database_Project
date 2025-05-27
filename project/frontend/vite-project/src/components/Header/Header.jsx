import React from "react";
import headerStyle from './Header.module.css';
import Navbar from '../Navbar/navbar';
import Banner from '../../assets/icons/banner.jpeg';
import Logo from '../../assets/icons/camper-van-and-motor-home-illustration-logo-vector.jpg';
import Profile_pic from '../../assets/icons/github.png';


function Header({className}) {
    return (
    <header className={`${headerStyle.header} ${className}`}>
        <img src={Banner} alt="" />
        <div className={`${headerStyle.logo} ${className}`}>
            <img src={Logo} alt="Logo" className={`${headerStyle.logoImage} ${className}`} />
        </div>

        <div className={`${headerStyle.navbarContainer} ${className}`}>
            <Navbar className={className} />
        </div>

        <div className={`${headerStyle.cart} ${className}`}>
            <img src={Profile_pic} alt="Cart" className={`${headerStyle.Profile_icon} ${className}`} />
        </div>
    </header>
    );
}

export default Header;