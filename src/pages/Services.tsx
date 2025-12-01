import React from "react";
import "../styles/services.css";

export type Service = {
  title: string;
  subtitle?: string;
  description: string;
  price?: string;
  image?: string;
};

export const serviceList: Service[] = [
  {
    title: "Package A",
    subtitle: "Photo & Video Coverage",
    description:
      "Detailed photo and video coverage from preparation, ceremony, and reception.\n\n• 100 printed photos (4R size)\n• USB containing all soft copies",
    price: "₱ 20,000",
    image: "/images/packa.png",
  },
  {
    title: "Package B",
    subtitle: "Photo & Video Coverage with Prenup",
    description:
      "Detailed photo and video coverage from preparation, ceremony, and reception.\nPrenup photo session included.\n\n• 1 blow-up photo (A3 size)\n• 100 printed photos (4R size)\n• USB containing all soft copies",
    price: "₱ 30,000",
    image: "/images/packb.png",
  },
  {
    title: "Package C",
    subtitle: "Photo & Video Coverage with Prenup & SDE Video",
    description:
      "Same Day Edit (SDE) Video.\nDetailed photo and video coverage from preparation to reception.\nPre-debut photo session included.\n\n• 1 blow-up photo (A3 size)\n• 100 printed photos (4R size)\n• USB containing all soft copies",
    price: "₱ 45,000",
    image: "/images/packc.png",
  },
  {
    title: "Concept Shoot",
    description:
      "Unlimited photo session.\nThemed decor (you may request a custom theme).\nUnlimited shoot for 2 client-provided outfits.\nSoft edited copies included.\n\nFreebies:\n• 1pc Blow-Up A3\n• 6pcs 4R prints",
    price: "₱ 6,000",
    image: "/images/kids.png",
  },
  {
    title: "Classic Portrait",
    description:
      "Unlimited Shots.\nWith soft and hard copies.\n\nFREEBIE:\nVideo behind-the-scenes from our TikTok account.",
    price: "₱ 6,000",
    image: "/images/classicP.png",
  },
];

const Services: React.FC = () => {
  return (
    <div className="services-container">
      <h1 className="services-title">Our Services</h1>

      {serviceList.map((service, index) => (
        <div
          className={`service-card ${index % 2 === 1 ? "reverse" : ""}`}
          key={service.title}
        >
          {service.image && (
            <img src={service.image} alt={service.title} className="service-img" />
          )}

          <div className="service-info">
            <h2>{service.title}</h2>
            {service.subtitle && <h3>{service.subtitle}</h3>}
            <p style={{ whiteSpace: "pre-line" }}>{service.description}</p>
            {service.price && (
              <span className="service-price">{service.price}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services;
