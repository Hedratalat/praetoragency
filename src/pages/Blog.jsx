import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Lightbulb,
  Search,
  ArrowRight,
  Clock,
  User,
  TrendingUp,
  Target,
  Zap,
  X,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { MARKETING_ICONS } from "../utils/marketing";
import Navbar from "../components/Navbar/Navbar";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Blog() {
  const [activeTab, setActiveTab] = useState("blog");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Data states
  const [blogPosts, setBlogPosts] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [tips, setTips] = useState([]);

  // Modal states
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const items = document.querySelectorAll(".animate-item");
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("show");
        }, index * 100);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  // Fetch data from Firebase
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch blog posts
      const blogSnapshot = await getDocs(collection(db, "blogPosts"));
      const blogData = blogSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      blogData.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
      setBlogPosts(blogData);

      // Fetch case studies
      const caseSnapshot = await getDocs(collection(db, "caseStudies"));
      const caseData = caseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      caseData.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
      setCaseStudies(caseData);

      // Fetch tips
      const tipsSnapshot = await getDocs(collection(db, "tips"));
      const tipsData = tipsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      tipsData.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
      setTips(tipsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "cases", label: "Cases", icon: Search },
    { id: "tips", label: "Tips", icon: Lightbulb },
  ];

  const filterBySearch = (items, fields) =>
    items.filter((item) =>
      fields.some((field) =>
        item[field]?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );

  const getIconComponent = (iconName) => {
    const iconData = MARKETING_ICONS.find((i) => i.name === iconName);
    return iconData?.icon || Lightbulb;
  };

  const openArticleModal = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const closeArticleModal = () => {
    setShowArticleModal(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bodyBg text-white font-body">
        <style>{`
        .animate-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .animate-item.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

        {/* HERO SECTION */}
        <section className="bg-bodyBg text-whitePure py-14 sm:py-20 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary">
                Marketing Insights & Strategies
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Discover expert articles, case studies, and practical marketing
                tips to grow your brand, engage your audience, and improve your
                strategy.
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-xl mx-auto mt-8 "
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles, case studies, tips..."
                      className="w-full pl-12 pr-4 py-4 bg-cardBg border border-primary/20 rounded-xl focus:border-primary focus:outline-none transition-colors text-sm sm:text-base text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TABS */}
        <div className="top-0 z-50 bg-cardBg border-b border-primary/20 backdrop-blur-lg -mt-7">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto sm:overflow-x-hidden justify-start sm:justify-center gap-2 sm:gap-6 px-4 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-4 px-3 sm:px-6 font-medium transition whitespace-nowrap text-xs sm:text-base relative ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-heading">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-neon"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 space-y-12 sm:space-y-20">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading content...</p>
            </div>
          ) : (
            <>
              {/* BLOG = ALL */}
              {activeTab === "blog" && (
                <>
                  {/* ARTICLES */}
                  {blogPosts.length > 0 && (
                    <section>
                      <motion.div {...fadeIn}>
                        <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 sm:mb-8 flex items-center gap-3">
                          <BookOpen className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                          Latest Articles
                        </h2>
                      </motion.div>
                      {filterBySearch(blogPosts, ["title", "excerpt"]).length >
                      0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                          {filterBySearch(blogPosts, ["title", "excerpt"]).map(
                            (p, idx) => (
                              <motion.article
                                key={p.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  delay: idx * 0.1,
                                  duration: 0.5,
                                }}
                                className="relative group h-full"
                              >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                                <div className="relative bg-cardBg rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all h-full flex flex-col">
                                  <div className="relative overflow-hidden">
                                    <img
                                      src={p.image}
                                      alt={p.title}
                                      className="h-40 sm:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-primary-neon px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-blackPure">
                                      {p.category}
                                    </div>
                                  </div>
                                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg sm:text-xl font-heading font-semibold mt-2 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all line-clamp-2">
                                      {p.title}
                                    </h3>
                                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm sm:text-base flex-1">
                                      {p.excerpt}
                                    </p>
                                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-4">
                                      <span className="flex gap-1 items-center">
                                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {p.author}
                                      </span>
                                      <span className="flex gap-1 items-center">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {p.readTime} min read
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => openArticleModal(p)}
                                      className="w-full bg-gradient-to-r from-primary to-primary-neon text-blackPure py-2.5 rounded-lg font-heading font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group/btn"
                                    >
                                      Read More
                                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                  </div>
                                </div>
                              </motion.article>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-bold text-gray-400 mb-2">
                            No articles found
                          </h3>
                          <p className="text-gray-500">
                            Try adjusting your search to find what you're
                            looking for.
                          </p>
                        </div>
                      )}
                    </section>
                  )}

                  {/* CASE STUDIES */}
                  {caseStudies.length > 0 && (
                    <section>
                      <motion.div {...fadeIn}>
                        <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 sm:mb-8 flex items-center gap-3">
                          <TrendingUp className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                          Success Stories
                        </h2>
                      </motion.div>
                      {filterBySearch(caseStudies, [
                        "title",
                        "company",
                        "industry",
                      ]).length > 0 ? (
                        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                          {filterBySearch(caseStudies, [
                            "title",
                            "company",
                            "industry",
                          ]).map((c, idx) => (
                            <motion.div
                              key={c.id}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1, duration: 0.5 }}
                              className="relative group h-full"
                            >
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                              <div className="relative bg-gradient-to-br from-cardBg to-bodyBg p-6 sm:p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all h-full flex flex-col">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                  <div className="flex-1">
                                    <div className="text-primary-light text-xs sm:text-sm font-semibold mb-2">
                                      {c.industry}
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2">
                                      {c.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm sm:text-base">
                                      {c.company}
                                    </p>
                                  </div>
                                  <div className="bg-primary/20 border border-primary rounded-lg px-3 py-2 text-primary font-bold text-sm whitespace-nowrap">
                                    ROI: {c.roi}%
                                  </div>
                                </div>

                                <div className="space-y-4 mb-6 flex-1">
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                      <Target className="w-4 h-4 text-red-400" />
                                      Challenge
                                    </h4>
                                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                                      {c.challenge}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                      <Zap className="w-4 h-4 text-yellow-400" />
                                      Solution
                                    </h4>
                                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                                      {c.solution}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                      <TrendingUp className="w-4 h-4 text-green-400" />
                                      Results ({c.results?.length || 0})
                                    </h4>
                                    <ul className="space-y-2">
                                      {(c.results || [])
                                        .slice(0, 2)
                                        .map((r, i) => (
                                          <li
                                            key={i}
                                            className="text-gray-300 text-xs sm:text-sm flex items-start gap-2"
                                          >
                                            <span className="text-primary mt-1">
                                              ✓
                                            </span>
                                            {r}
                                          </li>
                                        ))}
                                      {c.results?.length > 2 && (
                                        <button
                                          onClick={() => {
                                            setActiveTab("cases");
                                            window.scrollTo({
                                              top: 0,
                                              behavior: "smooth",
                                            });
                                          }}
                                          className="text-primary text-xs font-semibold hover:underline"
                                        >
                                          +{c.results.length - 2} more results
                                        </button>
                                      )}
                                    </ul>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 pt-4 border-t border-primary/20">
                                  <span>Timeline: {c.timeline} months</span>
                                  <span className="hidden sm:inline">•</span>
                                  <span>Investment: {c.investment}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-bold text-gray-400 mb-2">
                            No case studies found
                          </h3>
                          <p className="text-gray-500">
                            Try adjusting your search to find what you're
                            looking for.
                          </p>
                        </div>
                      )}
                    </section>
                  )}

                  {/* TIPS */}
                  {tips.length > 0 && (
                    <section>
                      <motion.div {...fadeIn}>
                        <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 sm:mb-8 flex items-center gap-3">
                          <Lightbulb className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                          Quick Tips
                        </h2>
                      </motion.div>
                      {filterBySearch(tips, ["title", "description"]).length >
                      0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {filterBySearch(tips, ["title", "description"]).map(
                            (t, idx) => {
                              const TipIcon = getIconComponent(t.icon);
                              return (
                                <motion.div
                                  key={t.id}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    delay: idx * 0.05,
                                    duration: 0.5,
                                  }}
                                  className="relative group h-full"
                                >
                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                                  <div className="relative bg-cardBg p-6 rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all h-full flex flex-col">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-light to-primary rounded-xl flex items-center justify-center mb-3">
                                      <TipIcon className="text-white w-6 h-6" />
                                    </div>
                                    <span className="text-primary text-xs sm:text-sm font-semibold">
                                      {t.category}
                                    </span>
                                    <h4 className="font-heading font-semibold mt-2 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all text-sm sm:text-base line-clamp-2">
                                      {t.title}
                                    </h4>
                                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 flex-1">
                                      {t.description}
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-bold text-gray-400 mb-2">
                            No tips found
                          </h3>
                          <p className="text-gray-500">
                            Try adjusting your search to find what you're
                            looking for.
                          </p>
                        </div>
                      )}
                    </section>
                  )}
                </>
              )}

              {/* ARTICLES ONLY */}
              {activeTab === "articles" && (
                <>
                  {filterBySearch(blogPosts, ["title", "excerpt"]).length >
                  0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {filterBySearch(blogPosts, ["title", "excerpt"]).map(
                        (p, idx) => (
                          <motion.article
                            key={p.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="relative group h-full"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                            <div className="relative bg-cardBg rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all h-full flex flex-col">
                              <div className="relative overflow-hidden">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="h-40 sm:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-primary-neon px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-blackPure">
                                  {p.category}
                                </div>
                              </div>
                              <div className="p-4 sm:p-6 flex-1 flex flex-col">
                                <h3 className="text-lg sm:text-xl font-heading font-semibold mt-2 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all line-clamp-2">
                                  {p.title}
                                </h3>
                                <p className="text-gray-400 mb-4 text-sm sm:text-base line-clamp-2 flex-1">
                                  {p.excerpt}
                                </p>
                                <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-4">
                                  <span className="flex gap-1 items-center">
                                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {p.author}
                                  </span>
                                  <span className="flex gap-1 items-center">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {p.readTime} min read
                                  </span>
                                </div>
                                <button
                                  onClick={() => openArticleModal(p)}
                                  className="w-full bg-gradient-to-r from-primary to-primary-neon text-blackPure py-2.5 rounded-lg font-heading font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group/btn"
                                >
                                  Read Article
                                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </motion.article>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-bold text-gray-400 mb-2">
                        No articles found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search to find what you're looking
                        for.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* CASES ONLY */}
              {activeTab === "cases" && (
                <>
                  {filterBySearch(caseStudies, ["title", "company", "industry"])
                    .length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                      {filterBySearch(caseStudies, [
                        "title",
                        "company",
                        "industry",
                      ]).map((c, idx) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1, duration: 0.5 }}
                          className="relative group h-full"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                          <div className="relative bg-gradient-to-br from-cardBg to-bodyBg p-6 sm:p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all h-full flex flex-col">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                              <div className="flex-1">
                                <div className="text-primary-light text-xs sm:text-sm font-semibold mb-2">
                                  {c.industry}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2">
                                  {c.title}
                                </h3>
                                <p className="text-gray-400 text-sm sm:text-base">
                                  {c.company}
                                </p>
                              </div>
                              <div className="bg-primary/20 border border-primary rounded-lg px-3 py-2 text-primary font-bold text-sm whitespace-nowrap">
                                ROI: {c.roi}%
                              </div>
                            </div>

                            <div className="space-y-4 mb-6 flex-1">
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                  <Target className="w-4 h-4 text-red-400" />
                                  Challenge
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                  {c.challenge}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-yellow-400" />
                                  Solution
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                  {c.solution}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-green-400" />
                                  Results
                                </h4>
                                <ul className="space-y-2">
                                  {(c.results || []).map((r, i) => (
                                    <li
                                      key={i}
                                      className="text-gray-300 text-xs sm:text-sm flex items-start gap-2"
                                    >
                                      <span className="text-primary mt-1">
                                        ✓
                                      </span>
                                      {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 pt-4 border-t border-primary/20">
                              <span>Timeline: {c.timeline} months</span>
                              <span className="hidden sm:inline">•</span>
                              <span>Investment: {c.investment}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-bold text-gray-400 mb-2">
                        No case studies found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search to find what you're looking
                        for.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* TIPS ONLY */}
              {activeTab === "tips" && (
                <>
                  {filterBySearch(tips, ["title", "description"]).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filterBySearch(tips, ["title", "description"]).map(
                        (t, idx) => {
                          const TipIcon = getIconComponent(t.icon);
                          return (
                            <motion.div
                              key={t.id}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.05, duration: 0.5 }}
                              className="relative group h-full"
                            >
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                              <div className="relative bg-cardBg p-6 rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all h-full flex flex-col">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-light to-primary rounded-xl flex items-center justify-center mb-3">
                                  <TipIcon className="text-white w-6 h-6" />
                                </div>
                                <span className="text-primary text-xs sm:text-sm font-semibold">
                                  {t.category}
                                </span>
                                <h4 className="font-heading font-semibold mt-2 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all text-sm sm:text-base line-clamp-2">
                                  {t.title}
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm flex-1">
                                  {t.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-bold text-gray-400 mb-2">
                        No tips found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search to find what you're looking
                        for.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Article Modal */}
        {showArticleModal && selectedArticle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cardBg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-primary/20"
            >
              {/* Header */}
              <div className="sticky top-0 bg-cardBg border-b border-primary/20 p-6 flex items-center justify-between z-10">
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-primary to-primary-neon px-3 py-1 rounded-full text-xs font-semibold text-blackPure inline-block mb-2">
                    {selectedArticle.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-whitePure">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex gap-4 text-sm text-gray-400 mt-3">
                    <span className="flex gap-1 items-center">
                      <User className="w-4 h-4" />
                      {selectedArticle.author}
                    </span>
                    <span className="flex gap-1 items-center">
                      <Clock className="w-4 h-4" />
                      {selectedArticle.readTime} min read
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeArticleModal}
                  className="text-gray-400 hover:text-whitePure transition ml-4"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Image */}
                <div className="rounded-xl overflow-hidden mb-6">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-64 sm:h-96 object-cover"
                  />
                </div>

                {/* Excerpt */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {selectedArticle.excerpt}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
