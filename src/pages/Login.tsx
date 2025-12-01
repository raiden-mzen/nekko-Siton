import React, { useState } from "react";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FaCamera, FaHeart, FaStar } from "react-icons/fa";
import "../styles/login.css";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, password } = formData;

    const endpoint = isLogin
      ? "http://localhost/your-folder/login.php"
      : "http://localhost/your-folder/signup.php";

    const payload = isLogin
      ? { email, password }
      : { name, email, phone, password, userType };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      alert(result.message);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE BRAND */}
      <div className="login-brand">
        <div className="brand-content">
          <h1 className="brand-logo">NEKO SITON</h1>
          <p className="brand-tagline">Capturing Moments, Creating Memories</p>
          <div className="brand-features">
            <div className="feature">
              <span className="feature-icon"><FaCamera /></span>
              <span>Professional Photography Services</span>
            </div>
            <div className="feature">
              <span className="feature-icon"><FaHeart /></span>
              <span>Personalized Experience</span>
            </div>
            <div className="feature">
              <span className="feature-icon"><FaStar /></span>
              <span>Award-Winning Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-form-section">
        <div className="login-form-container">
          {/* Toggle */}
          <div className="user-type-toggle">
            <button
              className={`toggle-btn ${userType === "client" ? "active" : ""}`}
              onClick={() => setUserType("client")}
            >
              Client
            </button>
            <button
              className={`toggle-btn ${userType === "admin" ? "active" : ""}`}
              onClick={() => setUserType("admin")}
            >
              Admin
            </button>
          </div>

          {/* Header */}
          <div className="form-header">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>{isLogin ? `Sign in to your ${userType} account` : `Sign up as a ${userType}`}</p>
          </div>

          {/* FORM */}
          <form className="login-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <MdPerson className={`input-icon ${formData.name.length > 0 ? "hide" : ""}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <MdEmail className={`input-icon ${formData.email.length > 0 ? "hide" : ""}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-with-icon">
                  <MdPhone className={`input-icon ${formData.phone.length > 0 ? "hide" : ""}`} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <MdLock className={`input-icon ${formData.password.length > 0 ? "hide" : ""}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="form-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
