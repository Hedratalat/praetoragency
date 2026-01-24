import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import Navbar from "../components/Navbar/Navbar";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const contactSchema = z.object({
  fullName: z
    .string()
    .min(3, "Please enter a valid name.")
    .max(50, "Please enter a valid name.")
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, "Name should only contain letters"),
  company: z
    .string()
    .trim()
    .min(2, "Company name is required")
    .max(100, "Company name is too long")
    .regex(
      /^[\u0600-\u06FFa-zA-Z0-9\s\-&.,()]+$/,
      "Company name can only contain letters, numbers, spaces, and symbols: - & . , ( )",
    )
    .refine(
      (val) => val.length > 0 && val.trim().length > 0,
      "Company name is required",
    ),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .refine(
      (val) => {
        const lowerVal = val.toLowerCase();
        return /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.(com|net|org)(\.eg)?$/.test(
          lowerVal,
        );
      },
      { message: "Email must be a valid Gmail address" },
    ),
  phone: z
    .string()
    .regex(
      /^(?:\+2)?01[0125][0-9]{8}$/,
      "Phone must be a valid Egyptian number",
    ),
  service: z.string().min(1, "Please select a service"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
});

export default function Contact() {
  const [services, setServices] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  // Fetch services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));
        const servicesList = snapshot.docs.map((doc) => doc.data().title);
        setServices(servicesList);
      } catch (error) {
        console.log("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  //Firebase
  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "Messages"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent successfully");
      reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary">
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="Full Name"
                    data-gramm="false"
                    data-gramm_editor="false"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("company")}
                    type="text"
                    data-gramm="false"
                    data-gramm_editor="false"
                    placeholder="Company Name"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />{" "}
                  {errors.company && (
                    <p className="text-red-400 text-sm">
                      {errors.company.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("email")}
                    type="email"
                    data-gramm="false"
                    data-gramm_editor="false"
                    placeholder="Email Address"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("phone")}
                    type="tel"
                    data-gramm="false"
                    data-gramm_editor="false"
                    placeholder="Phone Number"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...register("service")}
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Service</option>
                    {services.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p className="text-red-400 text-sm">
                      {errors.service.message}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    rows="4"
                    data-gramm="false"
                    data-gramm_editor="false"
                    {...register("message")}
                    placeholder="Your Message"
                    className="w-full bg-grayLight text-whitePure px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-400 text-sm">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark transition
              text-blackPure font-semibold py-3 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
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
                  <a
                    href="mailto:info@praetoragency.com"
                    className="flex items-center gap-3 hover:text-primary transition "
                  >
                    <FaEnvelope className="text-primary" />
                    praetoragency.com
                  </a>

                  <p className="flex items-center gap-3">
                    <FaPhoneAlt className="text-primary" />
                    +20 10 28579123
                  </p>

                  <p className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-primary" />
                    Alexandria, Egypt
                  </p>
                </div>

                {/* Social Links */}
                <div className="mt-6">
                  <p className="mb-3 text-sm text-gray-400">Follow us</p>

                  <div className="flex items-center gap-4">
                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/share/1Gjj9PJ5do/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-11 h-11 flex items-center justify-center rounded-full 
        bg-grayLight hover:bg-blue-600 transition"
                    >
                      <FaFacebookF className="text-whitePure text-lg" />
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/praetor.agency"
                      target="_blank"
                      rel="noreferrer"
                      className="w-11 h-11 flex items-center justify-center rounded-full 
        bg-grayLight hover:bg-[#C13584]
 transition"
                    >
                      <FaInstagram className="text-whitePure text-lg" />
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://www.tiktok.com/@praetor.agency"
                      target="_blank"
                      rel="noreferrer"
                      className="w-11 h-11 flex items-center justify-center rounded-full 
        bg-grayLight hover:bg-grayDarkest transition"
                    >
                      <FaTiktok className="text-whitePure text-lg" />
                    </a>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/201028579123"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-3 w-full 
                bg-green-500 hover:bg-green-600 transition-colors 
                text-blackPure font-semibold py-3 rounded-xl"
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
