import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const pricingCategories = [
  { id: "social", name: "Social Media", icon: "📱" },
  { id: "web", name: "Web Development", icon: "💻" },
  { id: "content", name: "Content Creation", icon: "✍️" },
];

const packages = {
  social: [
    {
      name: "Starter",
      price: "299",
      icon: Sparkles,
      features: [
        "3 Social Media Platforms",
        "12 Posts per Month",
        "Basic Graphics Design",
        "Community Management",
        "Monthly Analytics Report",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "599",
      icon: Zap,
      features: [
        "5 Social Media Platforms",
        "20 Posts per Month",
        "Premium Graphics & Videos",
        "Advanced Community Management",
        "Weekly Analytics Reports",
        "Paid Ads Management (Budget Included)",
        "Content Calendar Planning",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "999",
      icon: Crown,
      features: [
        "All Social Media Platforms",
        "Unlimited Posts",
        "Premium Content Creation",
        "Dedicated Account Manager",
        "Real-time Analytics Dashboard",
        "Advanced Ads Campaigns",
        "Influencer Collaboration",
        "24/7 Support",
      ],
      popular: false,
    },
  ],
  web: [
    {
      name: "Basic Website",
      price: "799",
      icon: Sparkles,
      features: [
        "Up to 5 Pages",
        "Responsive Design",
        "Basic SEO Setup",
        "Contact Form",
        "1 Month Free Support",
        "Mobile Optimized",
      ],
      popular: false,
    },
    {
      name: "Business Website",
      price: "1499",
      icon: Zap,
      features: [
        "Up to 15 Pages",
        "Custom Design",
        "Advanced SEO",
        "CMS Integration",
        "3 Months Free Support",
        "E-commerce Ready",
        "Analytics Integration",
        "Speed Optimization",
      ],
      popular: true,
    },
    {
      name: "Enterprise Solution",
      price: "2999",
      icon: Crown,
      features: [
        "Unlimited Pages",
        "Custom Web Application",
        "Full SEO Package",
        "Advanced CMS",
        "6 Months Premium Support",
        "E-commerce Platform",
        "API Integration",
        "Custom Features",
        "Security & Hosting",
      ],
      popular: false,
    },
  ],
  content: [
    {
      name: "Content Starter",
      price: "399",
      icon: Sparkles,
      features: [
        "8 Blog Posts per Month",
        "Basic Copywriting",
        "SEO Optimized Content",
        "Topic Research",
        "2 Revisions",
      ],
      popular: false,
    },
    {
      name: "Content Pro",
      price: "699",
      icon: Zap,
      features: [
        "16 Blog Posts per Month",
        "Advanced Copywriting",
        "Full SEO Integration",
        "Keyword Research",
        "Content Strategy",
        "Unlimited Revisions",
        "Social Media Captions",
      ],
      popular: true,
    },
    {
      name: "Content Premium",
      price: "1299",
      icon: Crown,
      features: [
        "Unlimited Content",
        "Premium Copywriting",
        "Complete Content Strategy",
        "Video Scripts",
        "Email Campaigns",
        "White Papers & E-books",
        "Dedicated Content Manager",
        "Priority Support",
      ],
      popular: false,
    },
  ],
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState("social");
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
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
                Pricing Plans
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Transparent pricing for every business size. No hidden fees, no
                surprises.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4 mb-16 -mt-4">
              {pricingCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-8 py-4 rounded-xl font-heading font-semibold text-lg transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-primary to-primary-neon text-blackPure shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                      : "bg-cardBg text-gray-400 border border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages[activeCategory].map((pkg, index) => {
                const Icon = pkg.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`relative group ${
                      pkg.popular ? "lg:scale-105" : ""
                    }`}
                  >
                    {/* Popular badge */}
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-gradient-to-r from-primary to-primary-neon text-blackPure px-6 py-2 rounded-full font-semibold text-sm shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Glow effect */}
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 ${
                        pkg.popular ? "opacity-20" : ""
                      }`}
                    ></div>

                    <div
                      className={`relative bg-cardBg border rounded-2xl p-8 h-full transition-all duration-500 ${
                        pkg.popular
                          ? "border-primary/50"
                          : "border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-neon rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Icon className="text-blackPure" size={32} />
                        </div>
                      </div>

                      {/* Package name */}
                      <h3 className="text-2xl font-heading font-bold text-whitePure mb-2">
                        {pkg.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-heading font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                            ${pkg.price}
                          </span>
                          <span className="text-gray-400 font-medium">
                            /month
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6"></div>

                      {/* Features list */}
                      <div className="space-y-4 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + idx * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5">
                              <Check className="text-primary w-5 h-5 flex-shrink-0" />
                            </div>
                            <span className="text-gray-300 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <button
                        className={`w-full py-4 rounded-lg font-heading font-semibold transition-all duration-300 ${
                          pkg.popular
                            ? "bg-gradient-to-r from-primary to-primary-neon text-blackPure hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105"
                            : "bg-cardBg border-2 border-primary text-primary hover:bg-primary/10 hover:border-primary/80"
                        }`}
                      >
                        Get Started
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ / CTA Section */}
        <section className="py-20 relative overflow-hidden mt-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-neon/5"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              {...fadeIn}
              className="text-center bg-cardBg border border-primary/20 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-heading font-bold mb-6">
                Need a Custom Package?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                We can create a tailored solution that fits your specific needs
                and budget.
              </p>
              <button
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-neon text-blackPure font-heading font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group"
              >
                Contact Us for Custom Quote
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
