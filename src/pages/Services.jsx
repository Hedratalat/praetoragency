import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar/Navbar";
import { ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { MARKETING_ICONS } from "../utils/marketing";
import toast from "react-hot-toast";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const ServiceCard = ({ service, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get icon component from MARKETING_ICONS
  const iconData = MARKETING_ICONS.find((i) => i.name === service.icon);
  const Icon = iconData?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>

      <div className="relative bg-cardBg border border-primary/20 rounded-2xl p-8 h-full hover:border-primary/50 transition-all duration-500 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Icon container with animated gradient */}
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-neon rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            {Icon && <Icon className="text-blackPure" size={28} />}
          </div>
          <motion.div
            animate={
              isHovered ? { scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] } : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-primary to-primary-neon rounded-xl opacity-0"
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
          {service.features.slice(0, 4).map((feature, idx) => (
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
        <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "services"));
      const servicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Error loading services");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <section className="relative pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">
                  No services available yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    onClick={() => handleServiceClick(service.id)}
                  />
                ))}
              </div>
            )}
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
