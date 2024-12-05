import React from "react";
import "./footer.css";
import Navbar from "../NavBar.js";
import Footer from "../Footer.js";

const TermsAndConditions = () => {
  return (
    <>
    <Navbar />
    <div className="terms-container">
      <h1 className="terms-title">Terms and Conditions</h1>
      <p className="terms-intro">
        Welcome to our e-learning platform. By accessing or using our platform,
        you agree to abide by the following terms and conditions. Please read
        them carefully.
      </p>

      <section className="terms-section">
        <h2 className="section-title">1. Acceptance of Terms</h2>
        <p className="section-text">
          By registering, accessing, or using our platform, you agree to comply
          with these Terms and Conditions and our Privacy Policy. If you do not
          agree with these terms, you should discontinue use of the platform.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-title">2. User Accounts and Responsibilities</h2>
        <p className="section-text">
          You are responsible for maintaining the confidentiality of your
          account information, including your username and password, and for all
          activities that occur under your account.
        </p>
        <p className="section-text">
          Users must be at least 13 years old to create an account. Users under
          18 require permission from a parent or legal guardian.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-title">3. Intellectual Property</h2>
        <p className="section-text">
          All content available on this platform, including courses, videos,
          text, graphics, and logos, is the property of our platform or our
          content providers. Unauthorized use of this content is prohibited.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-title">4. Course Enrollment</h2>
        <p className="section-text">
          By enrolling in a course, you are granted a limited, non-exclusive,
          non-transferable license to access and view the course content for
          personal, non-commercial use.
        </p>
        <p className="section-text">
          Reselling or sharing course access with others is strictly prohibited.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-title">5. Payment and Refund Policy</h2>
        <p className="section-text">
          Payments are required for certain courses. Once purchased, course
          access is generally non-refundable, except in cases where we fail to
          deliver the course content as promised.
        </p>
        <p className="section-text">
          Any refund requests must be submitted within 14 days of purchase.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-title">6. Prohibited Activities</h2>
        <p className="section-text">
          You agree not to engage in any of the following prohibited activities:
        </p>
        <ul className="terms-list">
          <li>Using the platform for any unlawful purpose</li>
          <li>Sharing your account credentials with others</li>
          <li>Distributing course materials without authorization</li>
          <li>Disrupting or interfering with platform security</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2 className="section-title">7. Limitation of Liability</h2>
        <p className="section-text">
          We are not responsible for any direct, indirect, incidental, or
          consequential damages resulting from your use of the platform. Your
          sole remedy for dissatisfaction with the platform is to stop using it.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-title">8. Changes to Terms</h2>
        <p className="section-text">
          We reserve the right to modify these Terms and Conditions at any time.
          Any changes will be effective immediately upon posting on this page.
          It is your responsibility to review these Terms periodically.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-title">9. Contact Us</h2>
        <p className="section-text">
          If you have any questions about these Terms and Conditions, please
          contact us at{" "}
          <a href="mailto:support@example.com">support@example.com</a>.
        </p>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default TermsAndConditions;