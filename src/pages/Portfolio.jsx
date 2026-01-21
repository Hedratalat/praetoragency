import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import {
  Sparkles,
  ExternalLink,
  TrendingUp,
  Users,
  Target,
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Briefcase,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const portfolioItems = [
  {
    id: 1,
    title: "TechVision E-commerce Platform",
    category: "E-commerce",
    client: {
      name: "TechVision Electronics",
      industry: "Retail & E-commerce",
      location: "San Francisco, CA",
      duration: "6 months",
    },
    description:
      "Complete brand redesign and e-commerce platform development for a leading electronics retailer. We transformed their online presence with a modern, user-centric design and implemented advanced features including AI-powered recommendations and one-click checkout.",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Web Design", "Branding", "SEO", "UX/UI"],
    impact: [
      {
        metric: "+312%",
        label: "Conversion Rate Increase",
        description: "Optimized checkout flow and personalized recommendations",
      },
      {
        metric: "45K",
        label: "Monthly Active Visitors",
        description: "Organic traffic growth through SEO optimization",
      },
      {
        metric: "32%",
        label: "Cart Abandonment Rate",
        description:
          "Reduced from 78% with email sequences and UX improvements",
      },
      {
        metric: "+47%",
        label: "Average Order Value",
        description: "AI-powered product recommendations and upselling",
      },
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 2,
    title: "HealthPlus Social Media Campaign",
    category: "Social Media",
    client: {
      name: "HealthPlus Wellness Center",
      industry: "Health & Wellness",
      location: "New York, NY",
      duration: "8 months",
    },
    description:
      "Comprehensive social media strategy and content creation campaign for a premium wellness center. We developed a cohesive brand voice, created engaging content across all platforms, and implemented data-driven advertising strategies.",
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Social Media", "Content Creation", "Ads", "Influencer Marketing"],
    impact: [
      {
        metric: "150K",
        label: "Follower Growth",
        description: "From 5K to 150K followers across all platforms",
      },
      {
        metric: "4.8M",
        label: "Total Impressions",
        description: "Viral content reached millions of potential customers",
      },
      {
        metric: "8.5%",
        label: "Engagement Rate",
        description: "Industry-leading engagement through authentic content",
      },
      {
        metric: "2,000+",
        label: "Qualified Leads",
        description: "Direct conversions from social media campaigns",
      },
    ],
    color: "from-lime-500 to-emerald-500",
  },
  {
    id: 3,
    title: "FitLife Brand Identity",
    category: "Branding",
    client: {
      name: "FitLife Nutrition",
      industry: "Food & Beverage",
      location: "Los Angeles, CA",
      duration: "4 months",
    },
    description:
      "Complete brand identity creation from scratch for a new nutrition supplement company. We developed the brand strategy, logo, visual identity, packaging design, and brand guidelines to establish a strong market presence.",
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop",
    ],
    video: null,
    tags: ["Branding", "Logo Design", "Packaging", "Brand Strategy"],
    impact: [
      {
        metric: "95%",
        label: "Brand Recognition",
        description: "Achieved high recognition in target market within 1 year",
      },
      {
        metric: "3x",
        label: "Market Share Growth",
        description: "Tripled market share in competitive supplement industry",
      },
      {
        metric: "5",
        label: "Major Publications",
        description: "Featured in leading health and fitness magazines",
      },
      {
        metric: "3",
        label: "New Product Lines",
        description: "Successfully expanded to multiple product categories",
      },
    ],
    color: "from-emerald-500 to-cyan-500",
  },
  {
    id: 4,
    title: "CloudFlow SaaS Website",
    category: "Web Development",
    client: {
      name: "CloudFlow Solutions Inc.",
      industry: "SaaS Technology",
      location: "Austin, TX",
      duration: "5 months",
    },
    description:
      "Modern, high-performance SaaS website with custom animations, seamless integrations, and advanced features. Built with cutting-edge technologies to deliver exceptional user experience and performance.",
    images: [
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&h=800&fit=crop",
    ],
    video: null,
    tags: ["Web Development", "UI/UX", "Performance", "React"],
    impact: [
      {
        metric: "98",
        label: "PageSpeed Score",
        description: "Near-perfect Google PageSpeed performance rating",
      },
      {
        metric: "2.1s",
        label: "Load Time",
        description: "Lightning-fast page load times for better UX",
      },
      {
        metric: "+40%",
        label: "Demo Requests",
        description: "Significant increase in qualified demo requests",
      },
      {
        metric: "-55%",
        label: "Bounce Rate",
        description: "Improved user engagement and retention",
      },
    ],
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: 5,
    title: "FoodHub Video Marketing",
    category: "Video Production",
    client: {
      name: "FoodHub Delivery Service",
      industry: "Food Delivery",
      location: "Miami, FL",
      duration: "3 months",
    },
    description:
      "Complete video marketing campaign including brand story videos, product showcases, customer testimonials, and social media content. Created a cohesive visual narrative that resonated with the target audience.",
    images: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Video Production", "Marketing", "Content", "Storytelling"],
    impact: [
      {
        metric: "2M+",
        label: "Video Views",
        description: "Viral campaign reached over 2 million viewers",
      },
      {
        metric: "+40%",
        label: "App Downloads",
        description: "Direct attribution from video marketing campaigns",
      },
      {
        metric: "3",
        label: "Blog Features",
        description: "Featured on major food and lifestyle blogs",
      },
      {
        metric: "+65%",
        label: "Customer Retention",
        description: "Improved brand loyalty through storytelling",
      },
    ],
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 6,
    title: "Luxe Fashion Photography",
    category: "Photography",
    client: {
      name: "Luxe Apparel Co.",
      industry: "Fashion & Retail",
      location: "Paris, France",
      duration: "2 months",
    },
    description:
      "Professional product photography and editorial brand photoshoot for luxury fashion collection launch. Created stunning visuals that captured the essence of the brand and showcased products in the best light.",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
    ],
    video: null,
    tags: ["Photography", "Product", "Fashion", "Editorial"],
    impact: [
      {
        metric: "500+",
        label: "Photos Delivered",
        description: "High-quality professional photos for entire collection",
      },
      {
        metric: "98%",
        label: "Client Satisfaction",
        description: "Exceptional feedback and repeat business",
      },
      {
        metric: "2",
        label: "Magazine Features",
        description: "Images featured in Vogue and Elle magazines",
      },
      {
        metric: "2 weeks",
        label: "Sellout Time",
        description: "Entire collection sold out within 2 weeks of launch",
      },
    ],
    color: "from-lime-500 to-teal-500",
  },
];

const categories = [
  "All",
  "E-commerce",
  "Social Media",
  "Branding",
  "Web Development",
  "Video Production",
  "Photography",
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bodyBg text-whitePure font-body">
        {/* HERO SECTION - Same as Blog */}
        <section className="bg-bodyBg text-whitePure py-14 sm:py-20 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-4">
                Portfolio of Success Stories
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Explore our portfolio of successful projects that transformed
                businesses and delivered measurable results
              </p>
            </motion.div>
          </div>
        </section>

        {/* CATEGORY FILTER - Responsive like Blog */}
        {/* CATEGORY FILTER - Blog Style (No Scroll) */}
        <div className="top-0 z-50 bg-cardBg border-b border-primary/20 backdrop-blur-lg -mt-7">
          <div className="max-w-7xl mx-auto">
            <div
              className="
        flex flex-wrap
        justify-center
        gap-2 sm:gap-6
        px-4
      "
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
            relative
            px-4 py-3 sm:px-6 sm:py-4
            text-sm sm:text-base
            font-medium transition-colors duration-300
            ${
              activeCategory === category
                ? "text-primary"
                : "text-gray-400 hover:text-gray-200"
            }
          `}
                >
                  {category}

                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategoryPortfolio"
                      className="
                absolute bottom-0 left-0 right-0
                h-[2px]
                bg-gradient-to-r from-primary to-primary-neon
              "
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onClick={() => {
                    setSelectedProject(item);
                    setCurrentImageIndex(0);
                  }}
                  className="relative group cursor-pointer"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
                  ></div>

                  <div className="relative bg-cardBg border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-cardBg via-cardBg/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div
                        className={`absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r ${item.color} px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-blackPure`}
                      >
                        {item.category}
                      </div>

                      {/* Image Count Badge */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blackPure/60 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-whitePure flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="hidden sm:inline">
                          {item.images.length}
                        </span>
                        <span className="sm:hidden">{item.images.length}</span>
                        {item.video && (
                          <span className="hidden sm:inline"> + Video</span>
                        )}
                      </div>

                      {item.video && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 backdrop-blur-sm border-2 border-primary rounded-full flex items-center justify-center">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-primary ml-1" />
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="bg-gradient-to-r from-primary to-primary-neon text-blackPure px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                          <span className="hidden sm:inline">View Project</span>
                          <span className="sm:hidden">View</span>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="text-primary-light text-xs font-semibold mb-2">
                        {item.client.name}
                      </div>
                      <h3 className="text-base sm:text-xl font-heading font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-3 sm:mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {item.client.location}
                          </span>
                          <span className="sm:hidden">
                            {item.client.location.split(",")[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.client.duration}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {item.impact.slice(0, 2).map((imp, i) => (
                          <div
                            key={i}
                            className="bg-primary/5 border border-primary/10 rounded-lg p-2"
                          >
                            <div className="text-primary font-bold text-xs sm:text-sm">
                              {imp.metric}
                            </div>
                            <div className="text-gray-500 text-xs line-clamp-1">
                              {imp.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-6 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div {...fadeIn} className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4">
                Results That Speak for Themselves
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Our portfolio showcases real impact across industries
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                { icon: Target, number: "500+", label: "Projects Completed" },
                { icon: Users, number: "200+", label: "Happy Clients" },
                {
                  icon: TrendingUp,
                  number: "300%",
                  label: "Avg. ROI Increase",
                },
                { icon: Award, number: "50+", label: "Industry Awards" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                    <div className="relative bg-cardBg border border-primary/20 rounded-2xl p-4 sm:p-6 text-center hover:border-primary/50 transition-all">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
                      <div className="text-2xl sm:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-neon mb-1 sm:mb-2">
                        {stat.number}
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden mt-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-neon/5"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              {...fadeIn}
              className="text-center bg-cardBg border border-primary/20 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-heading font-bold mb-6">
                Ready to Start Your Success Story?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Let's create something amazing together. Join our portfolio of
                successful brands.
              </p>
              <button
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-neon text-blackPure font-heading font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group"
              >
                Start Your Project
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

        {/* Project Details Modal - Behance Style */}
        {selectedProject && (
          <div
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-blackPure/95 backdrop-blur-sm z-50 overflow-y-auto"
          >
            <div className="min-h-screen p-4 sm:p-8">
              <div
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl mx-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="fixed top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-cardBg/80 backdrop-blur-sm rounded-full flex items-center justify-center text-whitePure hover:bg-primary transition-all z-50 border border-primary/20"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Project Header */}
                <div className="mb-6 sm:mb-8 text-center">
                  <div
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${selectedProject.color} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-blackPure mb-3 sm:mb-4`}
                  >
                    {selectedProject.category}
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-neon px-4">
                    {selectedProject.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Client Information */}
                <div className="bg-cardBg border border-primary/20 rounded-2xl p-6 sm:p-8 mb-8">
                  <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Client Information
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Client</div>
                      <div className="text-sm font-semibold text-primary-light">
                        {selectedProject.client.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Industry</div>
                      <div className="text-sm font-semibold">
                        {selectedProject.client.industry}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Location</div>
                      <div className="text-sm font-semibold">
                        {selectedProject.client.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Duration</div>
                      <div className="text-sm font-semibold">
                        {selectedProject.client.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Gallery with Slider */}
                <div className="mb-8">
                  <div className="relative bg-cardBg border border-primary/20 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={selectedProject.images[currentImageIndex]}
                      alt={`${selectedProject.title} - Image ${
                        currentImageIndex + 1
                      }`}
                      className="w-full aspect-video object-cover"
                    />

                    {/* Navigation Arrows */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cardBg/80 backdrop-blur-sm rounded-full flex items-center justify-center text-whitePure hover:bg-primary transition-all border border-primary/20"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cardBg/80 backdrop-blur-sm rounded-full flex items-center justify-center text-whitePure hover:bg-primary transition-all border border-primary/20"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-blackPure/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                      {currentImageIndex + 1} / {selectedProject.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {selectedProject.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx
                            ? "border-primary"
                            : "border-primary/20 hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Section */}
                {selectedProject.video && (
                  <div className="mb-8">
                    <h3 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-primary" />
                      Project Video
                    </h3>
                    <div className="relative bg-cardBg border border-primary/20 rounded-2xl overflow-hidden">
                      <iframe
                        src={selectedProject.video}
                        className="w-full aspect-video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Impact & Results */}
                <div className="bg-cardBg border border-primary/20 rounded-2xl p-6 sm:p-8 mb-8">
                  <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Impact & Results
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProject.impact.map((imp, i) => (
                      <div key={i} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                        <div className="relative bg-bodyBg border border-primary/10 rounded-xl p-4 hover:border-primary/30 transition-all">
                          <div className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-neon mb-2">
                            {imp.metric}
                          </div>
                          <div className="text-sm font-semibold text-whitePure mb-1">
                            {imp.label}
                          </div>
                          <div className="text-xs text-gray-400">
                            {imp.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary-neon text-blackPure font-heading font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group">
                    Start Similar Project
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
