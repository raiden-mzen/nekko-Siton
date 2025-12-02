import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient"; // make sure this is set up
import "../styles/services.css";

type Service = {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("services").select("*");

      if (error) {
        console.error("Error fetching services:", error.message);
      } else {
        setServices(data as Service[]);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <div className="services-container">
      <h1 className="services-title">Our Services</h1>

      {loading ? (
        <p>Loading services...</p>
      ) : (
        services.map((service, index) => (
          <div
            className={`service-card ${index % 2 === 1 ? "reverse" : ""}`}
            key={service.id}
          >
            <img src={service.image} alt={service.title} className="service-img" />

            <div className="service-info">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <span className="service-price">{service.price}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Services;
