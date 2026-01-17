import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar/Navbar";
export default function Contact() {
  return (
    <>
      <Navbar />

      <section className="bg-bodyBg text-whitePure min-h-screen py-14 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              Contact Us
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Let’s talk about your project and how we can help bring your ideas
              to life.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className=" order-2 md:order-1  bg-cardBg p-8 rounded-2xl shadow-lg border border-grayLight"
            >
              <h2 className="text-2xl font-heading font-semibold mb-6 text-primary">
                Send Us a Message
              </h2>

              <form className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <select className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Select Service</option>
                    <option>Web Development</option>
                    <option>Mobile App Development</option>
                    <option>UI / UX Design</option>
                    <option>Digital Marketing</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows="4"
                    placeholder="Your Message"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark transition-colors text-blackPure font-semibold py-3 rounded-xl"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2 space-y-8"
            >
              <div className="bg-cardBg p-8 rounded-2xl shadow-lg border border-grayLight">
                <h2 className="text-2xl font-heading font-semibold mb-6 text-primary">
                  Contact Information
                </h2>

                <div className="space-y-4 text-gray-300">
                  <p className="flex items-center gap-3">
                    <FaEnvelope className="text-primary" />
                    contact@praetoragency.com
                  </p>

                  <p className="flex items-center gap-3">
                    <FaPhoneAlt className="text-primary" />
                    +20 10 28579123
                  </p>

                  <p className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-primary" />
                    Cairo, Egypt
                  </p>
                </div>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/+201028579123"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 transition-colors text-blackPure font-semibold py-3 rounded-xl"
                >
                  <FaWhatsapp className="text-xl" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Map */}
              <div className="bg-cardBg rounded-2xl overflow-hidden border border-grayLight shadow-lg">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps?q=Cairo,Egypt&output=embed"
                  className="w-full h-64 border-0"
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
