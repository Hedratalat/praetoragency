import { motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";

export default function About() {
  return (
    <>
      <Navbar />

      <section className="bg-bodyBg text-whitePure min-h-screen py-14 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              About Us
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              We build digital experiences that help brands grow, stand out, and
              succeed in the modern world.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* Company Story */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-cardBg p-8 rounded-2xl shadow-lg border border-grayLight"
            >
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">
                Our Story
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Our company was founded with a clear purpose: to create
                powerful, elegant, and user-focused digital solutions. What
                started as a small idea has grown into a dedicated team
                passionate about design, technology, and innovation.
              </p>
            </motion.div>

            {/* Vision & Mission */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="bg-cardBg p-8 rounded-2xl shadow-lg border border-grayLight"
            >
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">
                Vision & Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                <span className="font-semibold text-whitePure">
                  Our Vision:
                </span>{" "}
                To become a trusted digital partner for businesses worldwide.
              </p>
              <p className="text-gray-300 leading-relaxed mt-3">
                <span className="font-semibold text-whitePure">
                  Our Mission:
                </span>{" "}
                To deliver high-quality digital products that combine
                creativity, performance, and real business value.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 bg-cardBg p-10 rounded-2xl shadow-lg border border-grayLight"
            >
              <h2 className="text-2xl font-heading font-semibold text-primary mb-6 text-center">
                Our Core Values
              </h2>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {["Integrity", "Innovation", "Quality", "Customer Focus"].map(
                  (value, index) => (
                    <div
                      key={index}
                      className="bg-grayLight rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
                    >
                      <p className="font-semibold text-whitePure">{value}</p>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
