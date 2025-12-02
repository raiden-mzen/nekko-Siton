import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";


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
  const [userType, setUserType] = useState<"client" |  "admin">("client");
  const [showPassword, setShowPassword] = useState(false);

  const [isTyping, setIsTyping] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setIsTyping({
      ...isTyping,
      [name]: value.length > 0,
    });
  };

  const navigate = useNavigate();

  // ------------------------
  // SUPABASE AUTH
  // ------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, name, phone } = formData;

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert("Login successful!");
        // Determine user type and route
        const signedUser = data.user;
        const metaType = (signedUser?.user_metadata as any)?.userType as string | undefined;
        let resolvedType = metaType;
        if (!resolvedType && signedUser?.id) {
          try {
            const { data: profileData, error: profileErr } = await supabase
              .from("profiles")
              .select("user_type, userType")
              .eq("id", signedUser.id)
              .single();
            if (!profileErr && profileData) {
              resolvedType = profileData.user_type ?? profileData.userType;
            }
          } catch (err) {
            console.warn("Could not fetch profile user type:", err);
          }
        }
        if (resolvedType === "admin") navigate("/admin");
        else navigate("/");
      } else {
        if (userType === "admin") {
          // ADMIN REQUEST → stored in admin_requests table
          const { error: insertError } = await supabase.from("admin_requests").insert([
            {
              email,
              name,
              phone,
              status: "pending",
              requested_at: new Date().toISOString(),
            },
          ]);
          if (insertError) throw insertError;
          alert("Admin request submitted. An existing admin will review your application.");
        } else {
          // REGULAR SIGNUP (client)
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                phone,
                userType,
              },
            },
          });
          if (error) throw error;
          alert("Account created successfully! Please check your email to confirm.");
          console.log("User:", data.user);
        }
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Logged out successfully.");
    navigate("/login");
  };

  useEffect(() => {
    supabase.from("profiles").select("*").then(console.log);
  }, []);

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
            <p>
              {isLogin
                ? `Sign in to your ${userType} account`
                : `Sign up as a ${userType}`}
            </p>
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
                <button
                  type="button"
                  className="forgot-password"
                  style={{marginLeft: '1rem'}}
                  onClick={async () => {
                    if (!formData.email) {
                      alert('Please enter your email above first.');
                      return;
                    }
                    // Insert password reset request for admin
                    await supabase.from('password_reset_requests').insert([
                      {
                        email: formData.email,
                        requested_at: new Date().toISOString(),
                        status: 'pending',
                      },
                    ]);
                    alert('Password reset request sent to admin. You will be contacted soon.');
                  }}
                >
                  Forgot Password?
                </button>
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
            {/* Show logout if logged in (simple check) */}
            {window.localStorage.getItem('sb-auth-token') && (
              <button className="logout-btn" type="button" onClick={handleLogout} style={{marginTop: '1rem'}}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

