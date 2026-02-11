import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar/Navbar";
import {
  ArrowRight,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MARKETING_ICONS } from "../utils/marketing";
import toast from "react-hot-toast";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "services", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setService({ id: docSnap.id, ...docSnap.data() });
      } else {
        toast.error("Service not found");
        navigate("/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Error loading service details");
      navigate("/services");
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-bodyBg flex items-center justify-center">
          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        </div>
      </>
    );
  }

  if (!service) {
    return null;
  }

  // Get icon component
  const iconData = MARKETING_ICONS.find((i) => i.name === service.icon);
  const Icon = iconData?.icon;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bodyBg text-whitePure font-body">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-primary hover:text-primary-neon transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Services</span>
          </button>
        </div>

        {/* Hero Section */}
        {service.hero &&
          (service.hero.title ||
            service.hero.subtitle ||
            service.hero.imageUrl) && (
            <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-neon rounded-2xl flex items-center justify-center">
                        {Icon && <Icon className="text-blackPure" size={36} />}
                      </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary-neon bg-clip-text text-transparent">
                      {service.hero.title || service.title}
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {service.hero.subtitle || service.description}
                    </p>
                  </motion.div>

                  {service.hero.imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-neon rounded-2xl blur-lg opacity-30"></div>
                      <img
                        src={service.hero.imageUrl}
                        alt={service.title}
                        className="relative w-full h-auto rounded-2xl shadow-2xl"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </section>
          )}

        {/* Service Explanation */}
        {service.explanation && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-cardBg border border-primary/20 rounded-2xl p-8 md:p-12"
              >
                <h2 className="text-3xl font-heading font-bold mb-6 text-primary">
                  What We Offer
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {service.explanation}
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* Package Content */}
        {service.packageContent && service.packageContent.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-heading font-bold mb-8 text-center text-primary">
                  What's Included
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.packageContent.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-cardBg border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-all"
                    >
                      <CheckCircle className="text-primary w-6 h-6 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Before/After */}
        {service.beforeAfter &&
          (service.beforeAfter.before.text ||
            service.beforeAfter.after.text) && (
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-heading font-bold mb-12 text-center text-primary">
                    The Transformation
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Before */}
                    {service.beforeAfter.before.text && (
                      <div className="bg-cardBg border border-red-500/30 rounded-2xl p-8 hover:border-red-500/50 transition-all">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <h3 className="text-2xl font-heading font-bold text-red-400">
                            Before
                          </h3>
                        </div>
                        {service.beforeAfter.before.imageUrl && (
                          <img
                            src={service.beforeAfter.before.imageUrl}
                            alt="Before"
                            className="w-full h-48 object-cover rounded-xl mb-4"
                          />
                        )}
                        <p className="text-gray-300 leading-relaxed">
                          {service.beforeAfter.before.text}
                        </p>
                      </div>
                    )}

                    {/* After */}
                    {service.beforeAfter.after.text && (
                      <div className="bg-cardBg border border-primary/30 rounded-2xl p-8 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <h3 className="text-2xl font-heading font-bold text-primary">
                            After
                          </h3>
                        </div>
                        {service.beforeAfter.after.imageUrl && (
                          <img
                            src={service.beforeAfter.after.imageUrl}
                            alt="After"
                            className="w-full h-48 object-cover rounded-xl mb-4"
                          />
                        )}
                        <p className="text-gray-300 leading-relaxed">
                          {service.beforeAfter.after.text}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>
          )}

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-heading font-bold mb-8 text-center text-primary">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-cardBg border border-primary/20 rounded-xl overflow-hidden hover:border-primary/40 transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <h3 className="text-lg font-semibold text-whitePure pr-4">
                          {faq.question}
                        </h3>
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-gray-300 leading-relaxed border-t border-primary/10 pt-4">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center bg-gradient-to-br from-primary/10 to-primary-neon/10 border border-primary/20 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-heading font-bold mb-6">
                {service.cta?.title || "Ready to Get Started?"}
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                {service.cta?.description ||
                  "Let's discuss how this service can help you achieve your goals."}
              </p>
              <button
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-neon text-blackPure font-heading font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group"
              >
                {service.cta?.buttonText || "Contact Us"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
