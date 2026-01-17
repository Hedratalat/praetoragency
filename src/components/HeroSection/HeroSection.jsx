import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

function Button({ children, to, href, variant = "primary" }) {
  const base =
    "flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-primary text-black hover:bg-primary-light shadow-lg shadow-primary/30",
    secondary:
      "border border-primary text-primary hover:bg-primary hover:text-black",
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variants[variant]}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[85vh]
      bg-gradient-to-br from-blackPure via-grayDarkest to-blackPure
      overflow-hidden font-body"
    >
      {/* Grid background */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
         pt-12 sm:pt-28 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-whitePure  tracking-wide md:tracking-[0.07em]">
            We Build Brands{" "}
            <span className="relative inline-block">
              <span className="relative z-10">We Grow Businesses</span>
              <motion.span
                className="absolute bottom-2 left-0 right-0 h-3 "
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Full-service marketing agency delivering creative solutions and
            data-driven strategies to help your business thrive in the digital
            age.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button to="/contact">Get a Quote</Button>

            <Button to="/contact" variant="secondary">
              Book a Meeting
            </Button>

            <Button variant="secondary" href="https://wa.me/+201028579123">
              <FaWhatsapp className="mr-2 text-xl" />
              WhatsApp
            </Button>
          </div>
        </motion.div>

        {/* Scroll Down Icon */}
      </div>
      <motion.div
        className="absolute  inset-x-0 flex justify-center z-20 "
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FiChevronDown
          className="text-primary"
          size={34}
          style={{
            filter: "drop-shadow(0 0 10px rgba(16,185,129,0.6))",
          }}
        />
      </motion.div>
    </section>
  );
}
