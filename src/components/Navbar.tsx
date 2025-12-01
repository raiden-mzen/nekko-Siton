import React, { useState } from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";


const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">NEKKO SITON</div>

      {/* Desktop Links */}
      <ul className="navbar-links">
  <li><Link to="/">Home</Link></li>
  <li><Link to="/services">Services</Link></li>
  <li><Link to="/contact">Contact</Link></li>
  <li><Link to="/gallery">Gallery</Link></li>
  <li><Link to="/booking">Booking</Link></li>
  <li><Link to="/login">Login</Link></li>
</ul>

      {/* Hamburger Icon for Mobile */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
  <Link to="/">Home</Link>
  <Link to="/services">Services</Link>
  <Link to="/contact">Contact</Link>
  <Link to="/gallery">Gallery</Link>
  <Link to="/booking">Booking</Link>
  <Link to="/login">Login</Link>
</div>

    </nav>
  );
};

export default Navbar;