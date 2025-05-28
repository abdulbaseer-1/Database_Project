import React from "react";
import styles from "./About_us.module.css";

const AboutUs = () => {
  return (
    <section className={styles.aboutUs}>
      <div className={styles.container}>
        <h1>About Us</h1>
        <p>
          Welcome to <strong>SmartBus – Your Trusted Travel Partner</strong>. We are a modern and efficient Bus Management System built to simplify how passengers book, track, and manage their bus journeys.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to revolutionize public and private bus transportation through digital innovation. We provide a reliable, user-friendly platform for passengers and operators alike.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li>📅 Easy online seat reservations</li>
          <li>🚌 Real-time bus scheduling and updates</li>
          <li>💳 Secure online payments</li>
          <li>📍 Live tracking of buses</li>
          <li>📈 Admin dashboard for insights and control</li>
        </ul>

        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Efficiency:</strong> Fast booking and minimal wait times</li>
          <li><strong>Transparency:</strong> Clear schedules, pricing, and availability</li>
          <li><strong>Security:</strong> Reliable system with data protection</li>
          <li><strong>Support:</strong> Dedicated help team and 24/7 availability</li>
        </ul>

        <h2>Join the Smart Travel Experience</h2>
        <p>
          Whether you’re a passenger or a bus operator, SmartBus is here to make travel smarter, safer, and simpler.
        </p>

        <p><em>Thank you for choosing SmartBus. Safe travels!</em></p>
      </div>
    </section>
  );
};

export default AboutUs;
