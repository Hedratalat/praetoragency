import { motion } from "framer-motion";
import {
  Share2,
  Megaphone,
  Palette,
  Code,
  Video,
  Camera,
  Search,
  FileText,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const services = [
  {
    icon: Share2,
    title: "Social Media Management",
    description:
      "Build and engage your audience across all major platforms with strategic content.",
    features: [
      "Content Strategy",
      "Community Management",
      "Analytics & Reporting",
      "Brand Voice Development",
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Megaphone,
    title: "Social Media Ads",
    description:
      "Drive conversions with targeted ad campaigns that deliver measurable results.",
    features: [
      "Campaign Strategy",
      "Ad Creative Design",
      "A/B Testing",
      "ROI Optimization",
    ],
    color: "from-lime-500 to-emerald-500",
  },
  {
    icon: Palette,
    title: "Branding & Visual Identity",
    description:
      "Create a memorable brand that resonates with your target audience.",
    features: [
      "Logo Design",
      "Brand Guidelines",
      "Color Palette",
      "Typography System",
    ],
    color: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Code,
    title: "Web Design & Development",
    description:
      "Build stunning, high-performance websites that convert visitors into customers.",
    features: [
      "Responsive Design",
      "Custom Development",
      "Performance Optimization",
      "Maintenance & Support",
    ],
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: Video,
    title: "Video Production",
    description:
      "Tell your story with compelling video content that captures attention.",
    features: [
      "Concept Development",
      "Professional Filming",
      "Post Production",
      "Motion Graphics",
    ],
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Camera,
    title: "Photography",
    description:
      "Professional product and brand photography that showcases your business.",
    features: [
      "Product Photography",
      "Brand Photoshoots",
      "Image Retouching",
      "Creative Direction",
    ],
    color: "from-lime-500 to-teal-500",
  },
  {
    icon: Search,
    title: "SEO",
    description:
      "Improve your search rankings and drive organic traffic to your website.",
    features: [
      "Keyword Research",
      "On-Page Optimization",
      "Technical SEO",
      "Link Building",
    ],
    color: "from-emerald-500 to-lime-500",
  },
  {
    icon: FileText,
    title: "Content Creation",
    description:
      "Engage your audience with high-quality, strategic content that drives action.",
    features: [
      "Blog Writing",
      "Copywriting",
      "Content Strategy",
      "Editorial Calendar",
    ],
    color: "from-teal-500 to-lime-500",
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Button = ({ children, variant = "primary", onClick }) => {
  const baseClasses =
    "px-8 py-4 rounded-lg font-heading font-semibold transition-all duration-300 inline-flex items-center gap-2 group";
  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-primary-neon text-blackPure hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Glow effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${service.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
      ></div>

      <div className="relative bg-cardBg border border-primary/20 rounded-2xl p-8 h-full hover:border-primary/50 transition-all duration-500 overflow-hidden">
        {/* Animated background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        ></div>

        {/* Icon container with animated gradient */}
        <div className="relative mb-6">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
          >
            <Icon className="text-blackPure" size={28} />
          </div>
          <motion.div
            animate={
              isHovered ? { scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] } : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl opacity-0`}
          ></motion.div>
        </div>

        <h3 className="text-2xl font-heading font-bold text-whitePure mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all duration-300">
          {service.title}
        </h3>

        <p className="text-gray-400 font-body mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features list */}
        <div className="space-y-3 mb-6">
          {service.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + idx * 0.05 }}
              className="flex items-start gap-2"
            >
              <CheckCircle className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-sm font-body">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Learn more link */}
        <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all cursor-pointer">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Services() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bodyBg text-whitePure font-body">
        {/* Hero Section */}
        <section className="bg-bodyBg text-whitePure py-14 sm:py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary">
                Our Services
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                From social media management to web development, we offer a full
                suite of services designed to elevate your brand and drive
                measurable results.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden mt-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-neon/5"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              {...fadeIn}
              className="text-center bg-cardBg border border-primary/20 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-heading font-bold mb-6">
                Ready to Transform Your Brand?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Let's discuss how our services can help you achieve your
                business goals.
              </p>
              <button
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-neon text-blackPure font-heading font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group"
              >
                Schedule a Consultation
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
