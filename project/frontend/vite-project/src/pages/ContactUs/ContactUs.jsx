import React,{useState} from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import FormStyle from "./ContactUs.module.css"
import student1 from "../../assets/icons/bus cartoon vitage.jpg";
import github_logo from "../../assets/icons/github.png";

function ContactUs() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        alert("feedback sent");
    };

    return(
        <div>
            <Header/>
            <form className={FormStyle.form} onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    className={FormStyle.inputfield}
                    type="text"
                    placeholder="Username"
                    maxLength={20}
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    className={FormStyle.inputfield}
                    type="email"
                    placeholder="yourEmail@mail.com"
                    maxLength={20}
                    required
                />

                <label htmlFor="feedack">Email</label>
                <input
                    id="feedack"
                    name="feedack"
                    className={FormStyle.inputfield}
                    type="feedack"
                    placeholder="feedack....."
                    maxLength={20}
                    required
                />


                <button type="submit" onClick="submit" className={FormStyle.submitButton}>submit</button>
            </form>

            <div className={FormStyle.contact_container}>{/*flex with photos of me and my group members, description at the end */}
                <div className={FormStyle.contact}>
                    <img src={student1} alt="pic 1" />
                    <h5>Meet : Abdul-Baseer ;)</h5>
                    <p>A Computer Science student tasked with making this Assignment</p>
                    <a href="https://github.com/abdulbaseer-1" target="_blank"><img src={github_logo} alt="github"/></a>
                </div>

                <div className={FormStyle.description}>
                    <h3>Descrition:</h3>
                    <p>
                        Assignent 2 cart managment system using MERN, for Web programming class 2024 by Abdul-Baseer.
                    </p>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default ContactUs;