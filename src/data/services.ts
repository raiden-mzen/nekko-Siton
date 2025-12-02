export interface Service {
  title: string;
  subtitle?: string;
  description: string;
  price: string; // display price string
  image?: string;
}

export const serviceList: Service[] = [
  {
    title: "Package A",
    subtitle: "Photo & Video Coverage",
    description:
      "Detailed photo and video coverage from preparation, ceremony, and reception.\n100 printed photos (4R size)\nUSB containing all soft copies",
    price: "₱ 20,000",
    image: "/images/packa.png",
  },
  {
    title: "Package B",
    subtitle: "Photo & Video Coverage with Prenup",
    description:
      "Detailed photo and video coverage from preparation, ceremony, and reception.\nPrenup photo session included\n1 blow-up photo (A3 size)\n100 printed photos (4R size)\nUSB containing all soft copies",
    price: "₱ 30,000",
    image: "/images/packb.png",
  },
  {
    title: "Package C",
    subtitle: "Photo & Video Coverage with Prenup & SDE Video",
    description:
      "Same Day Edit (SDE) Video\nDetailed photo and video coverage from preparation to reception.\nPre-debut photo session included\n1 blow-up photo (A3 size)\n100 printed photos (4R size)\nUSB containing all soft copies",
    price: "₱ 45,000",
    image: "/images/packc.png",
  },
  {
    title: "Concept Shoot",
    description:
      "Photo session only (unlimited)\nWith themed decor (you can request your own theme)\nUnlimited shoot for 2 sets of outfits provided by the client\nWith soft edited copies\n\nFreebies:\n• 1pc blow up A3 size\n• 6pcs 4R size",
    price: "₱ 6,000",
    image: "/images/kids.png",
  },
  {
    title: "Classic Portrait",
    description:
      "Unlimited Shots\nWith soft and hard copies\n\nFREEBIE: Video behind the scenes from our TikTok account",
    price: "₱ 6,000",
    image: "/images/classicP.png",
  },
];
