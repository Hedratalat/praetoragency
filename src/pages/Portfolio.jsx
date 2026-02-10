import { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { MARKETING_ICONS } from "../utils/marketing";
import toast from "react-hot-toast";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch categories and projects from Firebase with real-time updates
  useEffect(() => {
    const unsubscribe = fetchPortfolioData();

    // Cleanup function to unsubscribe from listeners when component unmounts
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const getIconComponent = (iconName) => {
    const iconData = MARKETING_ICONS.find((i) => i.name === iconName);
    return iconData?.icon || Sparkles;
  };

  const fetchPortfolioData = async () => {
    setLoading(true);

    try {
      // Real-time listener for categories
      const unsubscribeCategories = onSnapshot(
        collection(db, "portfolioCategories"),
        (categoriesSnapshot) => {
          const categoriesData = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Sort categories by order
          categoriesData.sort((a, b) => {
            const orderA = a.order ?? Infinity;
            const orderB = b.order ?? Infinity;
            return orderA - orderB;
          });

          // Set categories - add "All" at the beginning
          const categoryNames = categoriesData.map((cat) => cat.name);
          setCategories(["All", ...categoryNames]);

          // Real-time listener for projects
          const unsubscribeProjects = onSnapshot(
            collection(db, "portfolioProjects"),
            (projectsSnapshot) => {
              const projectsData = projectsSnapshot.docs.map((doc) => {
                const data = doc.data();

                // Find the category data to get the name
                const categoryData = categoriesData.find(
                  (cat) => cat.categoryId === data.category,
                );

                return {
                  id: doc.id,
                  ...data,
                  categoryName: categoryData?.name || "Uncategorized",
                  categoryIcon: categoryData?.icon || "Sparkles",
                };
              });

              // Sort projects by order
              projectsData.sort((a, b) => {
                const orderA = a.order ?? Infinity;
                const orderB = b.order ?? Infinity;
                return orderA - orderB;
              });

              setPortfolioItems(projectsData);
              setLoading(false);
            },
            (error) => {
              console.error("Error fetching projects:", error);
              toast.error("Failed to load projects");
              setLoading(false);
            },
          );

          // Store unsubscribe function for projects
          return () => {
            unsubscribeProjects();
          };
        },
        (error) => {
          console.error("Error fetching categories:", error);
          toast.error("Failed to load categories");
          setLoading(false);
        },
      );

      // Store unsubscribe function for categories
      return () => {
        unsubscribeCategories();
      };
    } catch (error) {
      console.error("Error setting up real-time listeners:", error);
      toast.error("Failed to load portfolio data");
      setLoading(false);
    }
  };

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.categoryName === activeCategory);

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1,
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bodyBg text-whitePure font-body">
        {/* HERO SECTION */}
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
                Real projects, measurable results. Explore our portfolio of
                successful campaigns that transformed businesses and delivered
                concrete ROI.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CATEGORY FILTER */}
        <div className="top-0 z-50 bg-cardBg border-b border-primary/20 backdrop-blur-lg -mt-7">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-6 px-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    relative px-4 py-3 sm:px-6 sm:py-4
                    text-sm sm:text-base font-medium transition-colors duration-300
                    ${activeCategory === category ? "text-primary" : "text-gray-400 hover:text-gray-200"}
                  `}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategoryPortfolio"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-primary-neon"
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-400">Loading portfolio...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Briefcase className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">
                  {activeCategory === "All"
                    ? "No projects available yet"
                    : `No projects in ${activeCategory} category`}
                </p>
              </div>
            ) : (
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
                          {item.categoryName}
                        </div>

                        {/* Media Count Badge */}
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
                          <span>{item.images.length}</span>
                          {item.video && (
                            <span className="hidden sm:inline">+ Video</span>
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
                            <span className="hidden sm:inline">
                              View Details
                            </span>
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
                              {item.client.location?.split(",")[0]}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.client.duration} months
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
            )}
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
                Our portfolio showcases real, measurable impact across
                industries
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                { icon: Target, number: "200+", label: "Projects Completed" },
                { icon: Users, number: "200+", label: "Happy Clients" },
                { icon: TrendingUp, number: "285%", label: "Avg. Growth Rate" },
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

        {/* CTA Section */}
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
                Let's create measurable results together. Join our portfolio of
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
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Project Details Modal */}
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
                    {selectedProject.categoryName}
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

                  {selectedProject.client.description && (
                    <div className="mb-4 pb-4 border-b border-primary/10">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {selectedProject.client.description}
                      </p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Client Name
                      </div>
                      <div className="text-sm font-semibold text-primary-light">
                        {selectedProject.client.name}
                      </div>
                    </div>
                    {selectedProject.client.industry && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Industry
                        </div>
                        <div className="text-sm font-semibold">
                          {selectedProject.client.industry}
                        </div>
                      </div>
                    )}
                    {selectedProject.client.location && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Location
                        </div>
                        <div className="text-sm font-semibold">
                          {selectedProject.client.location}
                        </div>
                      </div>
                    )}
                    {selectedProject.client.duration && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Project Duration
                        </div>
                        <div className="text-sm font-semibold">
                          {selectedProject.client.duration} months
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Gallery with Slider */}
                <div className="mb-8">
                  <h3 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
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
                    Project Gallery
                  </h3>

                  <div className="relative bg-cardBg border border-primary/20 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={selectedProject.images[currentImageIndex]}
                      alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
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
                  {selectedProject.images.length > 1 && (
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
                  )}
                </div>

                {/* Video Section */}
                {selectedProject.video && (
                  <div className="mb-8">
                    <h3 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-primary" />
                      Project Showcase Video
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
                  <h3 className="text-xl font-heading font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Measurable Impact & Results
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    All metrics are real, verified data from the project
                    duration
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProject.impact.map((imp, i) => (
                      <div key={i} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                        <div className="relative bg-bodyBg border border-primary/10 rounded-xl p-4 hover:border-primary/30 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-neon">
                              {imp.metric}
                            </div>
                            {imp.measurable && (
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
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
                {selectedProject.tags && selectedProject.tags.length > 0 && (
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
                )}

                {/* CTA Button */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      navigate("/contact");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-primary-neon text-blackPure font-heading font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group"
                  >
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
        `}</style>
      </div>
    </>
  );
}
