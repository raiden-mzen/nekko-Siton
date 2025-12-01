import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";



const Home: React.FC = () => {
  return (
<>
    <div className="home">
    
    

      {/* Background Scrolling Images */}
      <div className="sliding-bg">
        <img src="/images/bg1.jpg" alt="bg1" />
        <img src="/images/bg2.jpg" alt="bg2" />
        <img src="/images/bg3.jpg" alt="bg3" />
        <img src="/images/bg4.jpg" alt="bg4" />
        <img src="/images/bg1.jpg" alt="bg1" />
        <img src="/images/bg2.jpg" alt="bg2" />
        <img src="/images/bg3.jpg" alt="bg3" />
        <img src="/images/bg4.jpg" alt="bg4" />
        
      </div>

      <div className="bg-darken"></div>

      {/* Hero Content */}
      <section className="hero">
      <h1 className="NekoText">NEKKO SITON</h1>
        <div className="hero-text">
          <h1>Capture Moments That Matter</h1>
          <p>
            Professional photography services for weddings, portraits, and events.
          </p>
          <Link to="/booking">
  <button className="hero-button">Book a Session</button>
</Link>
        </div>
      </section>
     
      </div>
      
  
      
      
    
    </>


    
  );
};

export default Home;