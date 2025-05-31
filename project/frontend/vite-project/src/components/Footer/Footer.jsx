import footer_style from "./Footer.module.css";
import github_logo from "../../assets/icons/github.png";
function Footer({className}) {
    return(
        <div className={`${footer_style.footer} ${className}`}>
            <div className={footer_style.to_center}>
                <div className={footer_style.contact_grid}>
                    <div className={footer_style.website_summary}>
                       <h5>&copy; {new Date().getFullYear()} Bus Management System. All rights reserved.</h5><br />
<p>
  The Bus Management System is committed to delivering a seamless, reliable, and user-friendly platform for bus ticket booking, schedule tracking, and route management. 
  Please ensure all booking details are accurate. Misuse of the system may lead to suspension or legal action in accordance with our terms of service.
</p>
 </div>
                    <div className={footer_style.contact_1}>
                        <a href="https://github.com/abdulbaseer-1" target="_blank"><img src={github_logo} alt="instagram"/> <p>Abdul Baseer</p></a>
                    </div>
                    <div className={footer_style.contact_2}>
                        <a href="https://github.com/Mudasirkhan975" target="_blank"><img src={github_logo} alt="github"/> <p>Mudasir khan</p></a>
                    </div>
                    <div className={footer_style.contact_3}>
                        <a href="https://github.com/mohsinakabilsins" target="_blank"><img src={github_logo} alt="email"/> <p>Muhammad mohsin</p></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;