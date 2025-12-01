import React, { useState } from "react";
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdAccessTime 
} from "react-icons/md";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter 
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { BsCalendarCheck } from "react-icons/bs";
import "../styles/contact.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Get In Touch</h1>
      <p className="contact-subtitle">
        Let's capture your special moments together
      </p>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              Thank you! We'll get back to you soon.
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Juan Dela Cruz"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="juan@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+63 912 345 6789"
              />
            </div>

            <div className="form-group">
              <label htmlFor="service">Service Interested In *</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a service</option>
                <option value="wedding">Wedding Photography</option>
                <option value="portrait">Portrait Photography</option>
                <option value="event">Event Photography</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us about your event, preferred date, and any special requirements..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <IoSend className="btn-icon" />
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info-section">
          <div className="info-card">
            <h2>Contact Information</h2>
            
            <div className="info-item">
              <div className="info-icon">
                <MdEmail />
              </div>
              <div>
                <h3>Email</h3>
                <p>contact@photography.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <MdPhone />
              </div>
              <div>
                <h3>Phone</h3>
                <p>+63 912 345 6789</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <MdLocationOn />
              </div>
              <div>
                <h3>Location</h3>
                <p>Cebu City, Central Visayas, Philippines</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <MdAccessTime />
              </div>
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: By Appointment Only</p>
              </div>
            </div>
          </div>

          <div className="social-card">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaFacebook className="social-icon" />
                Facebook
              </a>
              <a href="#" className="social-link">
                <FaInstagram className="social-icon" />
                Instagram
              </a>
              <a href="#" className="social-link">
                <FaTwitter className="social-icon" />
                Twitter
              </a>
            </div>
          </div>

          <div className="cta-card">
            <h3>Ready to Book?</h3>
            <p>Schedule a free consultation to discuss your photography needs</p>
            <button className="cta-btn">
              <BsCalendarCheck className="btn-icon" />
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {/* Map Section */}
<div className="map-section">
  <h2>Find Us</h2>
  <div className="map-container">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253385.32992110253!2d125.42822872167093!3d7.109099020772918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f91666de0072fb%3A0xb2cd5b8f65421d29!2sHukari%20Koh%20Unli%20Rice%20Barbecue%20%26%20Fried%20Chicken!5e0!3m2!1sen!2sph!4v1764056355737!5m2!1sen!2sph"
      width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Our Location"
    ></iframe>
  </div>
</div>
    </div>
  );
};

export default Contact;