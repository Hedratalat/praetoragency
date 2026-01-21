import { motion } from "framer-motion";
import { Users, Award, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { number: "10+", label: "Years", icon: Award },
  { number: "500+", label: "Clients", icon: Users },
  { number: "1000+", label: "Projects", icon: Target },
  { number: "98%", label: "Success Rate", icon: TrendingUp },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section className=" bg-grayDarkest relative overflow-hidden font-body pt-10 sm:pt-0 pb-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-neon/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div {...fadeIn}>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-500"></div>

              {/* Image container */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1709715357549-f2d587846ee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjB0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3NjY5NDI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Marketing team meeting"
                  className="rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] border-2 border-primary/20 w-full 
                  transform group-hover:scale-[1.02] transition-all duration-500  "
                />

                {/* Decorative corner elements */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            {/* Section label */}
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary-neon rounded-full"></div>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-whitePure">
              Who We Are
            </h2>

            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                MarketPro is a full-service marketing agency dedicated to
                helping businesses of all sizes achieve their growth objectives.
                With over 10 years of industry experience, we combine
                creativity, strategy, and data to deliver exceptional results.
              </p>
              <p>
                Our team of passionate marketers, designers, developers, and
                content creators work collaboratively to bring your brand vision
                to life. We don't just create campaigns – we build long-term
                partnerships based on trust, transparency, and measurable
                success.
              </p>
              <p>
                From startups to established enterprises, we've helped hundreds
                of clients increase their visibility, engage their audience, and
                drive sustainable growth. Your success is our mission.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 ">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="text-center group"
                  >
                    <div className="relative">
                      {/* Icon with glow */}
                      <div
                        className="w-16 h-12 mx-auto mb-3   bg-gradient-to-br
                       from-primary to-primary-neon rounded-lg flex items-center justify-center 
                       transform group-hover:scale-110 transition-all duration-300"
                      >
                        <Icon className="text-blackPure" size={32} />
                      </div>

                      {/* Number */}
                      <div
                        className=" font-heading
                        text-3xl md:text-4xl
                        font-bold
                        text-transparent
                        bg-clip-text
                        bg-gradient-to-r from-primary to-primary-neon
                        mb-1"
                      >
                        {stat.number}
                      </div>

                      {/* Label */}
                      <div className="text-sm text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10"
              onClick={() => {
                navigate("/about");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary-neon text-blackPure font-heading font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group">
                Learn More About Us
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
