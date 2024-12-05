import React, { useState } from "react";
import "./footer.css";
import Navbar from "../NavBar.js";
import Footer from "../Footer.js";

const HelpAndFAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleAnswer = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      category: "Account Setup",
      questions: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click the 'Sign Up' button at the top right corner and follow the instructions to register.",
        },
        {
          question: "What if I forget my password?",
          answer: "You can reset your password by clicking 'Forgot Password' on the login page. You'll receive an email with instructions to reset it.",
        },
      ],
    },
    {
      category: "Course Enrollment",
      questions: [
        {
          question: "How do I enroll in a course?",
          answer: "To enroll, browse the course catalog, select a course, and click 'Enroll'. You'll be guided through the payment process if applicable.",
        },
        {
          question: "Can I enroll in multiple courses at once?",
          answer: "Yes, you can enroll in as many courses as you'd like. Each course will be available in your dashboard.",
        },
      ],
    },
    {
      category: "Payments and Refunds",
      questions: [
        {
          question: "What payment methods are accepted?",
          answer: "We accept major credit cards, debit cards, and PayPal. All payments are processed securely.",
        },
        {
          question: "How do I request a refund?",
          answer: "If eligible, you can request a refund within 14 days of purchase by contacting support@example.com with your order details.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "I'm experiencing video playback issues. What should I do?",
          answer: "Ensure your browser is up-to-date, clear your cache, and try reloading the page. If issues persist, contact our support team.",
        },
        {
          question: "What browsers are supported?",
          answer: "Our platform supports the latest versions of Chrome, Firefox, Safari, and Edge for optimal performance.",
        },
      ],
    },
    {
      category: "General Questions",
      questions: [
        {
          question: "Can I access the courses on my mobile device?",
          answer: "Yes, our platform is mobile-friendly, so you can learn on-the-go using your smartphone or tablet.",
        },
        {
          question: "How do I contact customer support?",
          answer: "You can reach our support team via email at support@example.com. We aim to respond within 24 hours.",
        },
      ],
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="faq-container">
      <h1 className="faq-title">Help & FAQ</h1>
      <p className="faq-intro">
        Find answers to commonly asked questions below. If you need further assistance, please contact our support team.
      </p>

      {faqData.map((section, index) => (
        <div key={index} className="faq-section">
          <h2 className="faq-category">{section.category}</h2>
          {section.questions.map((item, qIndex) => (
            <div key={qIndex} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => toggleAnswer(`${index}-${qIndex}`)}
              >
                {item.question}
                <span className="faq-toggle">
                  {activeQuestion === `${index}-${qIndex}` ? "-" : "+"}
                </span>
              </div>
              {activeQuestion === `${index}-${qIndex}` && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
    <Footer/>
    </>
  );
};

export default HelpAndFAQ;








