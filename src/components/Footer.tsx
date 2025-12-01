import React from "react";
import "../styles/footer.css";
import { Link } from "react-router-dom";


// Import icons from react-icons
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section brand-info">
          <div className="footer-logo">NEKO SITON</div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} Neko Siton. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
  <li><Link to="/">Home</Link></li>
  <li><Link to="/services">Services</Link></li>
  <li><Link to="/contact">Contact</Link></li>
  <li><Link to="/gallery">Gallery</Link></li>
  <li><Link to="/booking">Booking</Link></li>
  <li><Link to="/login">Login</Link></li>
</ul>

        </div>

        {/* Contact Info */}
        <div className="footer-section contact-info">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:info@nekositon.com">info@nekositon.com</a></p>
          <p>Phone: <a href="tel:+1234567890">(123) 456-7890</a></p>
          <p>Location: 123 Main St, Anytown, USA</p>
        </div>

        {/* Social Media */}
        <div className="footer-section social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;