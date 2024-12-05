// import logo from './logo.svg';
import React from "react";
import "./footer.css";
import Navbar from "./../NavBar.js";
import Footer from "../Footer.js";

const CommunityPage = () => {
  return (
    <>
      <Navbar />
      <div className="community-container">
        <h1 className="community-title">Community</h1>
        <p className="community-intro">
          Welcome to our community! Connect with other learners, participate in
          discussions, and explore valuable resources.
        </p>

        {/* Join the Community Section */}
        <div className="community-section">
          <h2 className="community-section-title">Join the Community</h2>
          <p className="community-section-description">
            Become a part of our learning community to engage with instructors
            and fellow students. Share your learning journey, ask questions, and
            provide feedback.
          </p>
          <button className="community-button">Sign Up to Join</button>
        </div>

        {/* Discussion Groups Section */}
        <div className="community-section">
          <h2 className="community-section-title">Discussion Groups</h2>
          <p className="community-section-description">
            Join topic-specific discussion groups to dive deeper into subjects
            that interest you. Participate in conversations, share insights, and
            enhance your learning.
          </p>
          <div className="community-groups">
            <div className="community-group">
              <h3>Web Development</h3>
              <p>Explore trends and best practices in web development.</p>
            </div>
            <div className="community-group">
              <h3>Data Science</h3>
              <p>Connect with data enthusiasts and share insights.</p>
            </div>
            <div className="community-group">
              <h3>Machine Learning</h3>
              <p>Discuss the latest in AI and machine learning technologies.</p>
            </div>
            <div className="community-group">
              <h3>Career Advice</h3>
              <p>Seek guidance on career growth and networking.</p>
            </div>
          </div>
        </div>

        {/* Popular Posts Section */}
        <div className="community-section">
          <h2 className="community-section-title">Popular Posts</h2>
          <p className="community-section-description">
            Catch up on trending discussions and valuable insights shared by
            community members.
          </p>
          <div className="community-posts">
            <div className="community-post">
              <h4>How to Start a Career in Web Development</h4>
              <p>Posted by Sarah, 3 days ago</p>
            </div>
            <div className="community-post">
              <h4>Understanding Machine Learning Models</h4>
              <p>Posted by Alex, 5 days ago</p>
            </div>
            <div className="community-post">
              <h4>Top Data Science Tools in 2024</h4>
              <p>Posted by Emily, 1 week ago</p>
            </div>
          </div>
        </div>

        {/* Community Guidelines Section */}
        <div className="community-section">
          <h2 className="community-section-title">Community Guidelines</h2>
          <p className="community-section-description">
            Our community is a welcoming space for everyone. Please follow our
            guidelines to ensure a positive and respectful environment.
          </p>
          <ul className="community-guidelines">
            <li>Be respectful and considerate of others' opinions.</li>
            <li>Avoid spamming or promoting unrelated content.</li>
            <li>Stay on topic and contribute constructively.</li>
            <li>Report any inappropriate behavior to our support team.</li>
          </ul>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CommunityPage;
