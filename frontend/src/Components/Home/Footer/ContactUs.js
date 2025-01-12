import React from "react";
import "./footer.css";
import Navbar from "../NavBar.js";
import Footer from "../Footer.js";

const ContactUsInfo = () => {
  return (
    <>
    <Navbar />
    <div className="contact-info-container">
      <h1 className="contact-info-title">Contact Us</h1>
      <p className="contact-info-description">
        We're here to help! Reach out to us through any of the following
        methods, and our team will be happy to assist you.
      </p>

      <div className="contact-details">
        <div className="contact-section">
          <h2 className="contact-section-title">Customer Support</h2>
          <p className="contact-text">
            For any questions or issues, please reach out to our support team.
          </p>
          <p className="contact-item">
            Email: <a href="mailto:support@example.com">support@example.com</a>
          </p>
          <p className="contact-item">
            Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
          </p>
        </div>

        <div className="contact-section">
          <h2 className="contact-section-title">Office Address</h2>
          <p className="contact-text">
            Visit our headquarters or send us mail at the following address:
          </p>
          <address className="contact-address">
            E-Learning Platform HQ
            <br />
            123 Education St.
            <br />
            Knowledge City, ED 45678
          </address>
        </div>

        <div className="contact-section">
          <h2 className="contact-section-title">Business Inquiries</h2>
          <p className="contact-text">
            For partnerships or business inquiries, reach out to us here:
          </p>
          <p className="contact-item">
            Email:{" "}
            <a href="mailto:business@example.com">business@example.com</a>
          </p>
        </div>

        <div className="contact-section">
          <h2 className="contact-section-title">Social Media</h2>
          <p className="contact-text">
            Follow us on social media to stay updated:
          </p>
          <ul className="social-links">
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ContactUsInfo;