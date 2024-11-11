import React from "react";
import "./Footer.css";
import logo from "./../Home/logo.png";
import { NavLink } from "react-router-dom";
import videoFile from "./Anthem_V6.mp4";
import Navbar from "./NavBar";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="footer-tag">
          <h2>
            GET UPDATES ON FUN STUFF YOU PROBABLY WANT TO KNOW ABOUT IN YOUR
            INBOX.
          </h2>
          <img  src={logo} alt="logo" className="logo logo-style" style={{paddingTop:"30px"}}/>
          <h1 style={{color:"#007791"}}>Skillora</h1>
        </div>
        <div className="footer-menu">
          <h4>Menu</h4>
          <ul>
            <li><NavLink to="/about" className="url">About Us</NavLink></li>
            <li>Contact Us</li>
            <li>
              <em>Community</em> (Vibes)
            </li>
          </ul>
        </div>
        <div className="footer-menu">
          <h4>Support</h4>
          <ul>
            <li>Help & FAQ</li>
            <li>Terms & Conditions</li>
            <li><NavLink to="/policy" className="url">Privacy Policy</NavLink></li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};


export const AboutUs = () => {
  return (
    <>
    <Navbar/>
    <div className="about-us">
      {/* Section with Video Background */}
      <section className="hero-section">
        <video autoPlay muted loop className="background-video">
          <source src={videoFile} type="video/mp4" />
        </video>
        <div className="hero-content">
          <h2>Our Vision</h2>
          <h1>
            We envision a world where <span>anyone, anywhere</span> has the power to
            transform their lives through learning.
          </h1>
        </div>
      </section>

      {/* Partner Section */}
      <section className="partner-section">
        <p>
          We partner with more than 300 leading universities and companies to
          bring flexible, affordable, job-relevant online learning to individuals and
          organizations worldwide. We offer a range of learning opportunities—from
          hands-on projects and courses to job-ready certificates and degree programs.
        </p>
        <div className="partner-logos">
          <img src="https://images.ctfassets.net/00atxywtfxvd/4vOWgNjy4KExR8msqHnJEP/bb1557d60e8a29f6a5f09148f700bff5/partner-logos.png" alt="Partner Logo 3" />
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default Footer;
