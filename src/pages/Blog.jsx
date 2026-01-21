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
  Sparkles,
} from "lucide-react";
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

  /* ================= DATA ================= */
  const blogPosts = [
    {
      id: 1,
      title: "Digital Marketing Strategies for 2026",
      excerpt:
        "Discover the latest trends and techniques in digital marketing and how to apply them to your business",
      author: "Ahmed Mohamed",
      readTime: "5 min read",
      category: "Strategy",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    },
    {
      id: 2,
      title: "How to Build a Strong Brand on Social Media",
      excerpt:
        "A comprehensive guide to building a strong and influential presence on social media platforms",
      author: "Sarah Ali",
      readTime: "7 min read",
      category: "Social Media",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
    },
    {
      id: 3,
      title: "SEO Optimization: A Beginner's Guide",
      excerpt:
        "Learn the basics of SEO and how to improve your website's ranking in search results",
      author: "Mahmoud Hassan",
      readTime: "6 min read",
      category: "SEO",
      image:
        "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c5e0?w=800&h=500&fit=crop",
    },
    {
      id: 4,
      title: "Email Marketing Best Practices 2026",
      excerpt:
        "Boost your email campaigns with proven strategies that increase open rates and conversions",
      author: "Layla Ibrahim",
      readTime: "8 min read",
      category: "Email Marketing",
      image:
        "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&h=500&fit=crop",
    },
    {
      id: 5,
      title: "Content Marketing That Converts",
      excerpt:
        "Create content that not only attracts but converts visitors into loyal customers",
      author: "Omar Khalil",
      readTime: "6 min read",
      category: "Content",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    },
    {
      id: 6,
      title: "The Power of Influencer Marketing",
      excerpt:
        "Learn how to leverage influencers to expand your reach and build authentic connections",
      author: "Nour Hassan",
      readTime: "5 min read",
      category: "Influencer",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop",
    },
  ];

  const caseStudies = [
    {
      id: 1,
      title: "E-commerce Store Triples Revenue in 6 Months",
      company: "TechGear Electronics",
      industry: "E-commerce",
      challenge:
        "TechGear was struggling with high cart abandonment rates (78%) and low conversion rates (1.2%). Despite good traffic, sales were stagnant.",
      solution:
        "We implemented a comprehensive strategy including abandoned cart email sequences, personalized product recommendations using AI, optimized checkout flow with one-click purchase, and retargeting campaigns on Facebook and Google.",
      results: [
        "Revenue increased by 312% in 6 months",
        "Cart abandonment reduced to 32%",
        "Conversion rate jumped to 4.8%",
        "Average order value increased by 47%",
        "Customer lifetime value up by 89%",
      ],
      timeline: "6 months",
      investment: "$15,000",
      roi: "620%",
    },
    {
      id: 2,
      title: "SaaS Company Scales from 0 to 10K Users",
      company: "CloudFlow Solutions",
      industry: "SaaS",
      challenge:
        "A new project management SaaS had zero brand awareness and struggled to acquire users in a competitive market dominated by established players.",
      solution:
        "Launched a content-driven growth strategy with SEO-optimized blog posts, created a free tool that went viral on Product Hunt, implemented referral program with rewards, and ran targeted LinkedIn ads to decision-makers.",
      results: [
        "10,000+ active users in 8 months",
        "Featured on Product Hunt (#2 Product of the Day)",
        "500+ organic backlinks from authority sites",
        "MRR reached $42,000",
        "40% of users came through referrals",
      ],
      timeline: "8 months",
      investment: "$22,000",
      roi: "380%",
    },
    {
      id: 3,
      title: "Local Restaurant Chain Dominates Regional Market",
      company: "Burger Bistro",
      industry: "Food & Beverage",
      challenge:
        "A family-owned burger chain with 5 locations had minimal online presence and was losing customers to delivery apps and competitors.",
      solution:
        "Built a mobile-first website with online ordering, created Instagram-worthy menu items and ran UGC campaigns, partnered with local food influencers, optimized Google My Business and local SEO, and launched a loyalty app.",
      results: [
        "Online orders increased by 440%",
        "Instagram following grew from 2K to 45K",
        "Opened 3 new locations due to demand",
        "Featured in 5 major food publications",
        "App downloads exceeded 18,000",
      ],
      timeline: "10 months",
      investment: "$18,500",
      roi: "520%",
    },
    {
      id: 4,
      title: "B2B Service Provider Generates 200+ Qualified Leads Monthly",
      company: "Enterprise Consulting Group",
      industry: "B2B Services",
      challenge:
        "A consulting firm relied heavily on cold outreach and networking events, with inconsistent lead flow and long sales cycles.",
      solution:
        "Developed thought leadership content strategy with whitepapers and webinars, implemented LinkedIn Sales Navigator campaigns, created case study library with measurable results, and optimized website for lead capture with valuable lead magnets.",
      results: [
        "220+ qualified leads per month",
        "Sales cycle reduced from 6 months to 3.5 months",
        "Close rate improved from 8% to 24%",
        "LinkedIn followers grew by 12,000",
        "Webinar attendance averaged 300+ per session",
      ],
      timeline: "7 months",
      investment: "$25,000",
      roi: "450%",
    },
  ];

  const tips = [
    {
      id: 1,
      title: "Use the 80/20 Content Rule",
      description:
        "80% valuable educational content, 20% promotional. Build trust first, sell second.",
      category: "Content",
      icon: "📊",
    },
    {
      id: 2,
      title: "Know Your Audience Deeply",
      description:
        "Create detailed buyer personas. The more specific your targeting, the better your results.",
      category: "Strategy",
      icon: "🎯",
    },
    {
      id: 3,
      title: "Always A/B Test Everything",
      description:
        "Test headlines, images, CTAs, and copy. Small changes can lead to massive improvements.",
      category: "Optimization",
      icon: "🔬",
    },
    {
      id: 4,
      title: "Engagement > Follower Count",
      description:
        "1,000 engaged followers beat 10,000 inactive ones. Focus on quality over quantity.",
      category: "Social Media",
      icon: "💬",
    },
    {
      id: 5,
      title: "Video Content Wins",
      description:
        "Video generates 12x more engagement than text and images combined. Invest in it.",
      category: "Content",
      icon: "🎥",
    },
    {
      id: 6,
      title: "Monitor Your Competitors",
      description:
        "Learn from their wins and mistakes. Use tools like SEMrush and SimilarWeb for insights.",
      category: "Strategy",
      icon: "👀",
    },
    {
      id: 7,
      title: "Mobile-First Design Always",
      description:
        "70% of users browse on mobile. If your site isn't mobile-optimized, you're losing sales.",
      category: "UX",
      icon: "📱",
    },
    {
      id: 8,
      title: "Leverage User-Generated Content",
      description:
        "Customer reviews and testimonials convert 5x better than brand content. Use them.",
      category: "Content",
      icon: "⭐",
    },
  ];

  const tabs = [
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "cases", label: "Cases", icon: Search },
    { id: "tips", label: "Tips", icon: Lightbulb },
  ];

  const filterBySearch = (items, fields) =>
    items.filter((item) =>
      fields.some((field) =>
        item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  /* ================= UI ================= */
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              ></motion.div>
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
          {/* BLOG = ALL */}
          {activeTab === "blog" && (
            <>
              {/* ARTICLES */}
              <section>
                <motion.div {...fadeIn}>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 sm:mb-8 flex items-center gap-3">
                    <BookOpen className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    Latest Articles
                  </h2>
                </motion.div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filterBySearch(blogPosts, ["title", "excerpt"]).map(
                    (p, idx) => (
                      <motion.article
                        key={p.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                        <div className="relative bg-cardBg rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all">
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
                          <div className="p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-heading font-semibold mt-2 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all">
                              {p.title}
                            </h3>
                            <p className="text-gray-400 mb-4 line-clamp-2 text-sm sm:text-base">
                              {p.excerpt}
                            </p>
                            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-4">
                              <span className="flex gap-1 items-center">
                                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                {p.author}
                              </span>
                              <span className="flex gap-1 items-center">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                {p.readTime}
                              </span>
                            </div>
                            <button className="w-full bg-gradient-to-r from-primary to-primary-neon text-blackPure py-2.5 rounded-lg font-heading font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group/btn">
                              Read More
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    )
                  )}
                </div>
              </section>

              {/* CASE STUDIES */}
              <section>
                <motion.div {...fadeIn}>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 sm:mb-8 flex items-center gap-3">
                    <TrendingUp className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    Success Stories
                  </h2>
                </motion.div>
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  {caseStudies.map((c, idx) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-cardBg to-bodyBg p-6 sm:p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all">
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
                            ROI: {c.roi}
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
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
                              {c.results.map((r, i) => (
                                <li
                                  key={i}
                                  className="text-gray-300 text-xs sm:text-sm flex items-start gap-2"
                                >
                                  <span className="text-primary mt-1">✓</span>
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 pt-4 border-t border-primary/20">
                          <span>Timeline: {c.timeline}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Investment: {c.investment}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* TIPS */}
              <section>
                <motion.div {...fadeIn}>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 sm:mb-8 flex items-center gap-3">
                    <Lightbulb className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    Quick Tips
                  </h2>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tips.map((t, idx) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                      <div className="relative bg-cardBg p-6 rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
                        <div className="text-3xl sm:text-4xl mb-3">
                          {t.icon}
                        </div>
                        <span className="text-primary text-xs sm:text-sm font-semibold">
                          {t.category}
                        </span>
                        <h4 className="font-heading font-semibold mt-2 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all text-sm sm:text-base">
                          {t.title}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {t.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ARTICLES ONLY */}
          {activeTab === "articles" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filterBySearch(blogPosts, ["title", "excerpt"]).map((p, idx) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                  <div className="relative bg-cardBg rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all">
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
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-heading font-semibold mt-2 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all">
                        {p.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm sm:text-base">
                        {p.excerpt}
                      </p>
                      <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-4">
                        <span className="flex gap-1 items-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          {p.author}
                        </span>
                        <span className="flex gap-1 items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {p.readTime}
                        </span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-primary to-primary-neon text-blackPure py-2.5 rounded-lg font-heading font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group/btn">
                        Read Article
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* CASES ONLY */}
          {activeTab === "cases" && (
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
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-cardBg to-bodyBg p-6 sm:p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all">
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
                        ROI: {c.roi}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
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
                          {c.results.map((r, i) => (
                            <li
                              key={i}
                              className="text-gray-300 text-xs sm:text-sm flex items-start gap-2"
                            >
                              <span className="text-primary mt-1">✓</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 pt-4 border-t border-primary/20">
                      <span>Timeline: {c.timeline}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Investment: {c.investment}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* TIPS ONLY */}
          {activeTab === "tips" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterBySearch(tips, ["title", "description"]).map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                  <div className="relative bg-cardBg p-6 rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
                    <div className="text-3xl sm:text-4xl mb-3">{t.icon}</div>
                    <span className="text-primary text-xs sm:text-sm font-semibold">
                      {t.category}
                    </span>
                    <h4 className="font-heading font-semibold mt-2 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-neon transition-all text-sm sm:text-base">
                      {t.title}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {t.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
