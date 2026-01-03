export interface Template {
  id: number;
  title: string;
  description: string;
  image: string;
  gallery?: string[];
  demoUrl: string;
  categories: string[];
  views: number;
  likes: number;
  price: string;
  priceValue?: number;
  isNew?: boolean;
  features?: string[];
  techStack?: string[];
  author?: string;
}

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 1,
    title: "E-commerce Pro",
    description: "Modern e-commerce template with advanced features like filtering, cart, and checkout flows.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&q=80&w=800"
    ],
    demoUrl: "#",
    categories: ["E-commerce", "Business"],
    views: 1240,
    likes: 342,
    price: "Free",
    priceValue: 0,
    isNew: true,
    features: ["Responsive Design", "Shopping Cart", "Payment Integration", "User Dashboard"],
    techStack: ["React", "Next.js", "Tailwind CSS", "Stripe"],
    author: "ZoneVast Team"
  },
  {
    id: 2,
    title: "Portfolio Plus",
    description: "Showcase your work with this elegant, minimal portfolio designed for creatives and agencies.",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800"
    ],
    demoUrl: "#",
    categories: ["Portfolio", "Creative"],
    views: 856,
    likes: 186,
    price: "$29.99",
    priceValue: 29.99,
    features: ["Masonry Layout", "Project Filtering", "Dark Mode", "Contact Form"],
    techStack: ["Vue.js", "Nuxt", "Sass", "Framer Motion"],
    author: "CreativeStudios"
  },
  {
    id: 3,
    title: "SaaS Dashboard",
    description: "A fully responsive admin dashboard with charts, data tables, and user management screens.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    ],
    demoUrl: "#",
    categories: ["Business", "React"],
    views: 2100,
    likes: 567,
    price: "$49.00",
    priceValue: 49.00,
    isNew: true,
    features: ["Data Visualization", "User Roles", "Auth Ready", "Export to CSV"],
    techStack: ["React", "Recharts", "Material UI", "Firebase"],
    author: "DevPro"
  },
  {
    id: 4,
    title: "Blog & Magazine",
    description: "Content-focused template perfect for news sites, digital magazines, and personal blogs.",
    image: "https://images.unsplash.com/photo-1499750310159-52f0f83ad497?auto=format&fit=crop&q=80&w=800",
    demoUrl: "#",
    categories: ["Blog", "Creative"],
    views: 645,
    likes: 89,
    price: "Free",
    priceValue: 0,
    features: ["SEO Optimized", "Newsletter Signup", "Related Posts", "Comment System"],
    techStack: ["Gatsby", "GraphQL", "Styled Components", "Netlify CMS"],
    author: "ZoneVast Team"
  },
  {
    id: 5,
    title: "Restaurant & Food",
    description: "Appetizing design with menu management, reservation system, and gallery.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    demoUrl: "#",
    categories: ["Business", "Creative"],
    views: 430,
    likes: 67,
    price: "$19.99",
    priceValue: 19.99,
    features: ["Menu Management", "Table Reservation", "Gallery Grid", "Google Maps"],
    techStack: ["HTML5", "Bootstrap", "jQuery", "PHP"],
    author: "FoodieThemes"
  },
  {
    id: 6,
    title: "Tech Startup Landing",
    description: "High-conversion landing page optimized for SaaS products and mobile apps.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    demoUrl: "#",
    categories: ["Business", "Portfolio"],
    views: 1560,
    likes: 420,
    price: "Free",
    priceValue: 0,
    features: ["A/B Tested", "Pricing Tables", "Testimonials Slider", "Lead Capture"],
    techStack: ["React", "Tailwind CSS", "Vite", "HubSpot"],
    author: "StartupKit"
  }
];