import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import FormStyle from "./ContactUs.module.css";
import student1 from "../../assets/icons/Student-1.jpeg";
import student2 from "../../assets/icons/WhatsApp Image 2025-05-28 at 01.14.49_92be9de7.jpg";
import student3 from "../../assets/icons/WhatsApp Image 2025-05-28 at 15.08.10_5c164116.jpg";
import github_logo from "../../assets/icons/github.png";

function ContactUs() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Feedback sent. Thank you!");
  };

  return (
    <div>
      <Header />
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          className={FormStyle.inputfield}
          type="email"
          placeholder="yourEmail@mail.com"
          maxLength={50}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="feedback">Feedback</label>
        <textarea
          id="feedback"
          name="feedback"
          className={FormStyle.inputfield}
          placeholder="Write your feedback here..."
          maxLength={300}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />

        <button type="submit" className={FormStyle.submitButton}>
          Submit
        </button>
      </form>

      <div className={FormStyle.contact_container}>
        {/* Member 1 */}
        <div className={FormStyle.contact}>
          <img src={student1} alt="Abdul-Baseer" />
          <h5>Meet: Abdul-Baseer</h5>
          <p>Computer Science student and full-stack web developer.</p>
          <a href="https://github.com/abdulbaseer-1" target="_blank" rel="noreferrer">
            <img src={github_logo} alt="GitHub" />
          </a>
        </div>

        {/* Member 2 */}
        <div className={FormStyle.contact}>
          <img src={student2} alt="Mudasir Khan" />
          <h5>Meet: Mudasir Khan</h5>
          <p>Passionate about UI/UX design and frontend development. </p>
          <a href="https://github.com/Mudasirkhan975" target="_blank" rel="noreferrer">
            <img src={github_logo} alt="GitHub" />
          </a>
        </div>

        {/* Member 3 */}
        <div className={FormStyle.contact}>
          <img src={student3} alt="Muhammad Mohsin" />
          <h5>Meet: Muhammad Mohsin</h5>
          <p>Software engineering enthusiast with expertise in backend systems.</p>
          <a href="https://github.com/mohsinakabilsins" target="_blank" rel="noreferrer">
            <img src={github_logo} alt="GitHub" />
          </a>
        </div>
      </div>

      {/* Description Section - clearly separated */}
      <div className={FormStyle.description}>
        <h3>Description:</h3>
        <p>
          This Bus Management System is a comprehensive web application designed
          to facilitate smooth scheduling, booking, and management of bus routes
          and services. Developed as a collaborative project using the MERN stack,
          it aims to provide users with a seamless ticket booking experience and
          admins with efficient operational controls.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;
