import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Search,
  RefreshCw,
  BookOpen,
  FileText,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  User,
  Clock,
  Target,
  Zap,
  CheckCircle,
  Image as ImageIcon,
  List,
  Grid3x3,
  Tag,
  Eye,
  EyeOff,
  BarChart3,
  Megaphone,
  MousePointerClick,
  Users,
  Video,
  TrendingDown,
  Heart,
  Award,
  Rocket,
  Mail,
  Globe,
  Smartphone,
  PenTool,
  ShoppingCart,
  Crown,
  Flame,
  Star,
  MessageCircle,
  Share2,
  DollarSign,
  Camera,
  Gift,
  ThumbsUp,
  Send,
  Code,
  Monitor,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { MARKETING_ICONS } from "../utils/marketing";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function BlogDash() {
  // States for blog posts
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // States for case studies
  const [caseStudies, setCaseStudies] = useState([]);
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [showEditCaseModal, setShowEditCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // States for tips
  const [tips, setTips] = useState([]);
  const [showAddTipModal, setShowAddTipModal] = useState(false);
  const [showEditTipModal, setShowEditTipModal] = useState(false);
  const [editingTip, setEditingTip] = useState(null);

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  // View mode
  const [viewMode, setViewMode] = useState("grid");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Blog Post Form States
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogOrder, setBlogOrder] = useState(0);

  // Case Study Form States
  const [caseTitle, setCaseTitle] = useState("");
  const [caseCompany, setCaseCompany] = useState("");
  const [caseIndustry, setCaseIndustry] = useState("");
  const [caseChallenge, setCaseChallenge] = useState("");
  const [caseSolution, setCaseSolution] = useState("");
  const [caseResultInput, setCaseResultInput] = useState("");
  const [caseResults, setCaseResults] = useState([]);
  const [caseTimeline, setCaseTimeline] = useState("");
  const [caseInvestment, setCaseInvestment] = useState("");
  const [caseROI, setCaseROI] = useState("");
  const [caseOrder, setCaseOrder] = useState(0);

  // Tip Form States
  const [tipTitle, setTipTitle] = useState("");
  const [tipDescription, setTipDescription] = useState("");
  const [tipCategory, setTipCategory] = useState("");
  const [tipIcon, setTipIcon] = useState("BarChart3");
  const [tipOrder, setTipOrder] = useState(0);

  // Popular icons for tips (from MARKETING_ICONS)
  const tipIcons = [
    // Analytics
    "BarChart3",
    "BarChart4",
    "PieChart",
    "Activity",
    "Target",
    "Lightbulb",
    "Rocket",
    "Zap",

    "Video",
    "Camera",
    "PenTool",
    "ImagePlus",
    "Palette",

    "MessageCircle",
    "Share2",
    "ThumbsUp",
    "Heart",
    "Users",

    "Megaphone",
    "MousePointerClick",
    "DollarSign",
    "ShoppingCart",

    "Crown",
    "Award",
    "Sparkles",
    "Flame",

    "Code",
    "Monitor",
    "Layers",
    "Cloud",
    "Database",

    "CheckCircle",
    "ShieldCheck",
    "BadgeCheck",

    "Mail",
    "Globe",
    "Send",
    "CalendarClock",

    "TrendingUp",
    "TrendingDown",
    "Percent",
    "Filter",
    "SlidersHorizontal",
    "Search",
    "Eye",
    "LayoutTemplate",
    "Smartphone",
    "Laptop",
    "Workflow",
    "Map",
    "Flag",
    "Timer",
    "Hourglass",
    "ClipboardCheck",
    "FileText",
    "UsersRound",
  ];

  useEffect(() => {
    fetchBlogPosts();
    fetchCaseStudies();
    fetchTips();
  }, []);

  // ============ BLOG POSTS FUNCTIONS ============
  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "blogPosts"));
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      postsData.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        return orderA - orderB;
      });

      setBlogPosts(postsData);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlogPost = async () => {
    if (
      !blogTitle ||
      !blogExcerpt ||
      !blogAuthor ||
      !blogReadTime ||
      !blogCategory ||
      !blogImage
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "blogPosts"), {
        title: blogTitle,
        excerpt: blogExcerpt,
        author: blogAuthor,
        readTime: blogReadTime,
        category: blogCategory,
        image: blogImage,
        order: parseInt(blogOrder) || 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Blog post added successfully");
      resetBlogForm();
      setShowAddBlogModal(false);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error adding blog post:", error);
      toast.error("Error adding blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlogPost = async () => {
    if (
      !blogTitle ||
      !blogExcerpt ||
      !blogAuthor ||
      !blogReadTime ||
      !blogCategory ||
      !blogImage
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "blogPosts", editingBlog.id), {
        title: blogTitle,
        excerpt: blogExcerpt,
        author: blogAuthor,
        readTime: blogReadTime,
        category: blogCategory,
        image: blogImage,
        order: parseInt(blogOrder) || 0,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Blog post updated successfully");
      resetBlogForm();
      setShowEditBlogModal(false);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Error updating blog post");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteBlogPost = (post) => {
    setDeleteTarget(post);
    setDeleteType("blog");
    setShowDeleteModal(true);
  };

  const handleDeleteBlogPost = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "blogPosts", deleteTarget.id));
      toast.success("Blog post deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Error deleting blog post");
    } finally {
      setLoading(false);
    }
  };

  const openEditBlogModal = (post) => {
    setEditingBlog(post);
    setBlogTitle(post.title);
    setBlogExcerpt(post.excerpt);
    setBlogAuthor(post.author);
    setBlogReadTime(post.readTime);
    setBlogCategory(post.category);
    setBlogImage(post.image);
    setBlogOrder(post.order || 0);
    setShowEditBlogModal(true);
  };

  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogExcerpt("");
    setBlogAuthor("");
    setBlogReadTime("");
    setBlogCategory("");
    setBlogImage("");
    setBlogOrder(0);
    setEditingBlog(null);
  };

  // ============ CASE STUDIES FUNCTIONS ============
  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "caseStudies"));
      const casesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      casesData.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        return orderA - orderB;
      });

      setCaseStudies(casesData);
    } catch (error) {
      console.error("Error fetching case studies:", error);
      toast.error("Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  const addCaseResult = () => {
    if (!caseResultInput.trim()) return;
    setCaseResults([...caseResults, caseResultInput]);
    setCaseResultInput("");
  };

  const removeCaseResult = (index) => {
    setCaseResults(caseResults.filter((_, i) => i !== index));
  };

  const handleAddCaseStudy = async () => {
    if (
      !caseTitle ||
      !caseCompany ||
      !caseIndustry ||
      !caseChallenge ||
      !caseSolution ||
      caseResults.length === 0 ||
      !caseTimeline ||
      !caseInvestment ||
      !caseROI
    ) {
      toast.error("Please fill all fields and add at least one result");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "caseStudies"), {
        title: caseTitle,
        company: caseCompany,
        industry: caseIndustry,
        challenge: caseChallenge,
        solution: caseSolution,
        results: caseResults,
        timeline: caseTimeline,
        investment: caseInvestment,
        roi: caseROI,
        order: parseInt(caseOrder) || 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Case study added successfully");
      resetCaseForm();
      setShowAddCaseModal(false);
      fetchCaseStudies();
    } catch (error) {
      console.error("Error adding case study:", error);
      toast.error("Error adding case study");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCaseStudy = async () => {
    if (
      !caseTitle ||
      !caseCompany ||
      !caseIndustry ||
      !caseChallenge ||
      !caseSolution ||
      caseResults.length === 0 ||
      !caseTimeline ||
      !caseInvestment ||
      !caseROI
    ) {
      toast.error("Please fill all fields and add at least one result");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "caseStudies", editingCase.id), {
        title: caseTitle,
        company: caseCompany,
        industry: caseIndustry,
        challenge: caseChallenge,
        solution: caseSolution,
        results: caseResults,
        timeline: caseTimeline,
        investment: caseInvestment,
        roi: caseROI,
        order: parseInt(caseOrder) || 0,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Case study updated successfully");
      resetCaseForm();
      setShowEditCaseModal(false);
      fetchCaseStudies();
    } catch (error) {
      console.error("Error updating case study:", error);
      toast.error("Error updating case study");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCaseStudy = (caseStudy) => {
    setDeleteTarget(caseStudy);
    setDeleteType("case");
    setShowDeleteModal(true);
  };

  const handleDeleteCaseStudy = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "caseStudies", deleteTarget.id));
      toast.success("Case study deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchCaseStudies();
    } catch (error) {
      console.error("Error deleting case study:", error);
      toast.error("Error deleting case study");
    } finally {
      setLoading(false);
    }
  };

  const openEditCaseModal = (caseStudy) => {
    setEditingCase(caseStudy);
    setCaseTitle(caseStudy.title);
    setCaseCompany(caseStudy.company);
    setCaseIndustry(caseStudy.industry);
    setCaseChallenge(caseStudy.challenge);
    setCaseSolution(caseStudy.solution);
    setCaseResults(caseStudy.results || []);
    setCaseTimeline(caseStudy.timeline);
    setCaseInvestment(caseStudy.investment);
    setCaseROI(caseStudy.roi);
    setCaseOrder(caseStudy.order || 0);
    setShowEditCaseModal(true);
  };

  const resetCaseForm = () => {
    setCaseTitle("");
    setCaseCompany("");
    setCaseIndustry("");
    setCaseChallenge("");
    setCaseSolution("");
    setCaseResults([]);
    setCaseResultInput("");
    setCaseTimeline("");
    setCaseInvestment("");
    setCaseROI("");
    setCaseOrder(0);
    setEditingCase(null);
  };

  // ============ TIPS FUNCTIONS ============
  const fetchTips = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "tips"));
      const tipsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      tipsData.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        return orderA - orderB;
      });

      setTips(tipsData);
    } catch (error) {
      console.error("Error fetching tips:", error);
      toast.error("Failed to load tips");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTip = async () => {
    if (!tipTitle || !tipDescription || !tipCategory || !tipIcon) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "tips"), {
        title: tipTitle,
        description: tipDescription,
        category: tipCategory,
        icon: tipIcon,
        order: parseInt(tipOrder) || 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Tip added successfully");
      resetTipForm();
      setShowAddTipModal(false);
      fetchTips();
    } catch (error) {
      console.error("Error adding tip:", error);
      toast.error("Error adding tip");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTip = async () => {
    if (!tipTitle || !tipDescription || !tipCategory || !tipIcon) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "tips", editingTip.id), {
        title: tipTitle,
        description: tipDescription,
        category: tipCategory,
        icon: tipIcon,
        order: parseInt(tipOrder) || 0,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Tip updated successfully");
      resetTipForm();
      setShowEditTipModal(false);
      fetchTips();
    } catch (error) {
      console.error("Error updating tip:", error);
      toast.error("Error updating tip");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteTip = (tip) => {
    setDeleteTarget(tip);
    setDeleteType("tip");
    setShowDeleteModal(true);
  };

  const handleDeleteTip = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "tips", deleteTarget.id));
      toast.success("Tip deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchTips();
    } catch (error) {
      console.error("Error deleting tip:", error);
      toast.error("Error deleting tip");
    } finally {
      setLoading(false);
    }
  };

  const openEditTipModal = (tip) => {
    setEditingTip(tip);
    setTipTitle(tip.title);
    setTipDescription(tip.description);
    setTipCategory(tip.category);
    setTipIcon(tip.icon);
    setTipOrder(tip.order || 0);
    setShowEditTipModal(true);
  };

  const resetTipForm = () => {
    setTipTitle("");
    setTipDescription("");
    setTipCategory("");
    setTipIcon("BarChart3");
    setTipOrder(0);
    setEditingTip(null);
  };

  // ============ HELPER FUNCTIONS ============
  const getIconComponent = (iconName) => {
    const iconData = MARKETING_ICONS.find((i) => i.name === iconName);
    return iconData?.icon || Sparkles;
  };

  const handleDelete = async () => {
    if (deleteType === "blog") {
      await handleDeleteBlogPost();
    } else if (deleteType === "case") {
      await handleDeleteCaseStudy();
    } else if (deleteType === "tip") {
      await handleDeleteTip();
    }
  };

  const filterBySearch = (items, fields) =>
    items.filter((item) =>
      fields.some((field) =>
        item[field]?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );

  return (
    <div className="min-h-screen bg-bodyBg py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-whitePure mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                <BookOpen className="text-primary" size={28} />
                <span>Blog Management</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Manage articles, case studies, and tips
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-cardBg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  Articles
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {blogPosts.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="text-primary" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-cardBg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Cases</p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {caseStudies.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-cyan-400" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-cardBg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Tips</p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {tips.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Lightbulb className="text-yellow-400" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-cardBg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">View</p>
                <div className="flex gap-2 mt-1 sm:mt-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 sm:p-2 rounded-lg transition ${
                      viewMode === "grid"
                        ? "bg-primary text-blackPure"
                        : "bg-grayLight text-gray-400 hover:text-whitePure"
                    }`}
                  >
                    <Grid3x3 size={16} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 sm:p-2 rounded-lg transition ${
                      viewMode === "list"
                        ? "bg-primary text-blackPure"
                        : "bg-grayLight text-gray-400 hover:text-whitePure"
                    }`}
                  >
                    <List size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex w-12 h-12 bg-blue-500/20 rounded-lg items-center justify-center">
                <Tag className="text-blue-400" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-primary/20">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, cases, tips..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-whitePure flex items-center gap-2">
              <FileText className="text-primary" size={20} />
              <span>Blog Articles</span>
            </h2>
            <button
              onClick={() => {
                resetBlogForm();
                setShowAddBlogModal(true);
              }}
              className="bg-gradient-to-r from-primary to-primary-neon text-blackPure px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition flex items-center gap-2 text-xs sm:text-sm"
            >
              <Plus size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Add Article</span>
            </button>
          </div>

          {blogPosts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                  : "space-y-2 sm:space-y-3"
              }
            >
              {filterBySearch(blogPosts, ["title", "excerpt", "author"]).map(
                (post) => {
                  if (viewMode === "list") {
                    return (
                      <div
                        key={post.id}
                        className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 hover:border-primary/30 transition flex flex-col xs:flex-row xs:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm sm:text-base font-bold text-whitePure truncate">
                                {post.title}
                              </h3>
                              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                                {post.category}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                              <User size={12} className="sm:w-3 sm:h-3" />
                              {post.author}
                              <span className="text-gray-500">•</span>
                              <Clock size={12} className="sm:w-3 sm:h-3" />
                              {post.readTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end xs:justify-start">
                          <button
                            onClick={() => openEditBlogModal(post)}
                            className="p-1.5 sm:p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition text-primary"
                          >
                            <Edit2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteBlogPost(post)}
                            className="p-1.5 sm:p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-red-400"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={post.id}
                      className="bg-grayLight rounded-lg sm:rounded-xl overflow-hidden border border-primary/10 hover:border-primary/30 transition"
                    >
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-32 sm:h-40 w-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-primary-neon px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-blackPure">
                          {post.category}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-bold text-whitePure mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span className="flex gap-1 items-center">
                            <User size={12} />
                            {post.author}
                          </span>
                          <span className="flex gap-1 items-center">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditBlogModal(post)}
                            className="flex-1 p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition text-primary text-xs sm:text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteBlogPost(post)}
                            className="flex-1 p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-red-400 text-xs sm:text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-400">
              <FileText className="mx-auto mb-2 sm:mb-3 opacity-50" size={40} />
              <p className="text-sm sm:text-base">
                No blog posts yet. Add your first article!
              </p>
            </div>
          )}
        </div>

        {/* Case Studies Section */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-whitePure flex items-center gap-2">
              <TrendingUp className="text-cyan-400" size={20} />
              <span>Case Studies</span>
            </h2>
            <button
              onClick={() => {
                resetCaseForm();
                setShowAddCaseModal(true);
              }}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition flex items-center gap-2 text-xs sm:text-sm"
            >
              <Plus size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Add Case</span>
            </button>
          </div>

          {caseStudies.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
              {filterBySearch(caseStudies, [
                "title",
                "company",
                "industry",
              ]).map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  className="bg-gradient-to-br from-grayLight to-grayDark p-4 sm:p-6 rounded-lg sm:rounded-xl border border-primary/10 hover:border-cyan-500/30 transition"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="text-cyan-400 text-xs sm:text-sm font-semibold mb-2">
                        {caseStudy.industry}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-whitePure mb-2">
                        {caseStudy.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {caseStudy.company}
                      </p>
                    </div>
                    <div className="bg-cyan-500/20 border border-cyan-500 rounded-lg px-2 py-1 text-cyan-400 font-bold text-xs whitespace-nowrap">
                      ROI: {caseStudy.roi}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-300 mb-1 flex items-center gap-2">
                        <Target className="w-3 h-3 text-red-400" />
                        Challenge
                      </h4>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {caseStudy.challenge}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-300 mb-1 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        Solution
                      </h4>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {caseStudy.solution}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        Results ({caseStudy.results?.length || 0})
                      </h4>
                      <ul className="space-y-1">
                        {(caseStudy.results || []).slice(0, 2).map((r, i) => (
                          <li
                            key={i}
                            className="text-gray-300 text-xs flex items-start gap-2"
                          >
                            <span className="text-cyan-400 mt-0.5">✓</span>
                            {r}
                          </li>
                        ))}
                        {caseStudy.results?.length > 2 && (
                          <p className="text-cyan-400 text-xs font-semibold">
                            +{caseStudy.results.length - 2} more
                          </p>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-primary/20">
                    <button
                      onClick={() => openEditCaseModal(caseStudy)}
                      className="flex-1 p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition text-cyan-400 text-xs sm:text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteCaseStudy(caseStudy)}
                      className="flex-1 p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-red-400 text-xs sm:text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-400">
              <TrendingUp
                className="mx-auto mb-2 sm:mb-3 opacity-50"
                size={40}
              />
              <p className="text-sm sm:text-base">
                No case studies yet. Add your first success story!
              </p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-whitePure flex items-center gap-2">
              <Lightbulb className="text-yellow-400" size={20} />
              <span>Quick Tips</span>
            </h2>
            <button
              onClick={() => {
                resetTipForm();
                setShowAddTipModal(true);
              }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition flex items-center gap-2 text-xs sm:text-sm"
            >
              <Plus size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Add Tip</span>
            </button>
          </div>

          {tips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filterBySearch(tips, ["title", "description"]).map((tip) => {
                const TipIconComponent = getIconComponent(tip.icon);
                return (
                  <div
                    key={tip.id}
                    className="bg-grayLight p-4 sm:p-6 rounded-lg sm:rounded-xl border border-primary/10 hover:border-yellow-500/30 transition"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-3">
                      <TipIconComponent className="text-white" size={24} />
                    </div>
                    <span className="text-yellow-400 text-xs sm:text-sm font-semibold">
                      {tip.category}
                    </span>
                    <h4 className="font-semibold mt-2 mb-2 text-whitePure text-sm sm:text-base line-clamp-2">
                      {tip.title}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-3">
                      {tip.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditTipModal(tip)}
                        className="flex-1 p-2 bg-yellow-500/20 rounded-lg hover:bg-yellow-500/30 transition text-yellow-400 text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Edit2 size={12} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDeleteTip(tip)}
                        className="flex-1 p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-red-400 text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
                <Lightbulb className="text-yellow-400 opacity-50" size={36} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-whitePure mb-2">
                No tips yet
              </h3>
              <p className="text-sm sm:text-base mb-4 sm:mb-6">
                Add your first marketing tip to help your audience!
              </p>
              <button
                onClick={() => {
                  resetTipForm();
                  setShowAddTipModal(true);
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition inline-flex items-center gap-2 text-xs sm:text-sm"
              >
                <Plus size={16} className="sm:w-4 sm:h-4" />
                Add First Tip
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Blog Modal */}
        {(showAddBlogModal || showEditBlogModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-primary/20">
              <div className="sticky top-0 bg-cardBg border-b border-primary/20 p-4 sm:p-6 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                  {showEditBlogModal ? "Edit Article" : "Add New Article"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddBlogModal(false);
                    setShowEditBlogModal(false);
                    resetBlogForm();
                  }}
                  className="text-gray-400 hover:text-whitePure transition"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g., Digital Marketing Strategies for 2026"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Excerpt
                  </label>
                  <textarea
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    placeholder="A brief description of the article..."
                    rows="3"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      placeholder="e.g., Ahmed Mohamed"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                      placeholder="e.g., 5 min read"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Category
                  </label>
                  <input
                    type="text"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    placeholder="e.g., Strategy, Social Media, SEO, Email Marketing, Content, Influencer, Analytics, Growth"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                  {blogImage && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <img
                        src={blogImage}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={blogOrder}
                    onChange={(e) => setBlogOrder(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers appear first (0 = first)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddBlogModal(false);
                      setShowEditBlogModal(false);
                      resetBlogForm();
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      showEditBlogModal ? handleEditBlogPost : handleAddBlogPost
                    }
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary-neon text-blackPure font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="sm:w-5 sm:h-5 animate-spin"
                        />
                        <span>
                          {showEditBlogModal ? "Updating..." : "Saving..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="sm:w-5 sm:h-5" />
                        <span>{showEditBlogModal ? "Update" : "Save"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Case Study Modal */}
        {(showAddCaseModal || showEditCaseModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-primary/20">
              <div className="sticky top-0 bg-cardBg border-b border-primary/20 p-4 sm:p-6 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                  {showEditCaseModal ? "Edit Case Study" : "Add New Case Study"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddCaseModal(false);
                    setShowEditCaseModal(false);
                    resetCaseForm();
                  }}
                  className="text-gray-400 hover:text-whitePure transition"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Case Study Title
                  </label>
                  <input
                    type="text"
                    value={caseTitle}
                    onChange={(e) => setCaseTitle(e.target.value)}
                    placeholder="e.g., E-commerce Store Triples Revenue in 6 Months"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={caseCompany}
                      onChange={(e) => setCaseCompany(e.target.value)}
                      placeholder="e.g., TechGear Electronics"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={caseIndustry}
                      onChange={(e) => setCaseIndustry(e.target.value)}
                      placeholder="e.g., E-commerce, SaaS, Food & Beverage, B2B Services, Healthcare, Education, Real Estate, Technology"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Challenge
                  </label>
                  <textarea
                    value={caseChallenge}
                    onChange={(e) => setCaseChallenge(e.target.value)}
                    placeholder="Describe the main challenge the client faced..."
                    rows="3"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Solution
                  </label>
                  <textarea
                    value={caseSolution}
                    onChange={(e) => setCaseSolution(e.target.value)}
                    placeholder="Describe the solution you provided..."
                    rows="3"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Results
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={caseResultInput}
                      onChange={(e) => setCaseResultInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCaseResult()}
                      placeholder="Add a result (press Enter)"
                      className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                    <button
                      onClick={addCaseResult}
                      className="bg-primary px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-blackPure hover:bg-primary-dark transition"
                    >
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {caseResults.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {caseResults.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-grayLight px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg group hover:bg-grayDark transition"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <CheckCircle
                              size={14}
                              className="sm:w-4 sm:h-4 text-cyan-400"
                            />
                            <span className="text-whitePure text-xs sm:text-sm">
                              {result}
                            </span>
                          </div>
                          <button
                            onClick={() => removeCaseResult(index)}
                            className="text-red-400 hover:text-red-500 transition"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Timeline (in months)
                    </label>
                    <input
                      type="number"
                      value={caseTimeline}
                      onChange={(e) => setCaseTimeline(e.target.value)}
                      placeholder="e.g., 6"
                      min="1"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter the number of months only
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Investment
                    </label>
                    <input
                      type="text"
                      value={caseInvestment}
                      onChange={(e) => setCaseInvestment(e.target.value)}
                      placeholder="e.g., EGP 15,000"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      ROI
                    </label>
                    <input
                      type="text"
                      value={caseROI}
                      onChange={(e) => setCaseROI(e.target.value)}
                      placeholder="e.g., 620%"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={caseOrder}
                    onChange={(e) => setCaseOrder(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers appear first (0 = first)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddCaseModal(false);
                      setShowEditCaseModal(false);
                      resetCaseForm();
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      showEditCaseModal
                        ? handleEditCaseStudy
                        : handleAddCaseStudy
                    }
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="sm:w-5 sm:h-5 animate-spin"
                        />
                        <span>
                          {showEditCaseModal ? "Updating..." : "Saving..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="sm:w-5 sm:h-5" />
                        <span>{showEditCaseModal ? "Update" : "Save"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Tip Modal */}
        {(showAddTipModal || showEditTipModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-primary/20">
              <div className="sticky top-0 bg-cardBg border-b border-primary/20 p-4 sm:p-6 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                  {showEditTipModal ? "Edit Tip" : "Add New Tip"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddTipModal(false);
                    setShowEditTipModal(false);
                    resetTipForm();
                  }}
                  className="text-gray-400 hover:text-whitePure transition"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Tip Title
                  </label>
                  <input
                    type="text"
                    value={tipTitle}
                    onChange={(e) => setTipTitle(e.target.value)}
                    placeholder="e.g., Use the 80/20 Content Rule"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Description
                  </label>
                  <textarea
                    value={tipDescription}
                    onChange={(e) => setTipDescription(e.target.value)}
                    placeholder="Explain the tip in detail..."
                    rows="4"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Category
                  </label>
                  <input
                    type="text"
                    value={tipCategory}
                    onChange={(e) => setTipCategory(e.target.value)}
                    placeholder="e.g., Content, Strategy, Optimization, Social Media, UX, Analytics"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Icon
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {tipIcons.map((iconName) => {
                      const IconComponent = getIconComponent(iconName);
                      return (
                        <button
                          key={iconName}
                          onClick={() => setTipIcon(iconName)}
                          className={`p-2 sm:p-3 rounded-lg transition relative group ${
                            tipIcon === iconName
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 ring-2 ring-yellow-400"
                              : "bg-grayLight hover:bg-yellow-500/20"
                          }`}
                          title={iconName}
                        >
                          <IconComponent
                            size={20}
                            className={`sm:w-6 sm:h-6 mx-auto ${
                              tipIcon === iconName
                                ? "text-white"
                                : "text-whitePure"
                            }`}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-blackPure text-whitePure text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            {iconName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={tipOrder}
                    onChange={(e) => setTipOrder(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers appear first (0 = first)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddTipModal(false);
                      setShowEditTipModal(false);
                      resetTipForm();
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showEditTipModal ? handleEditTip : handleAddTip}
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="sm:w-5 sm:h-5 animate-spin"
                        />
                        <span>
                          {showEditTipModal ? "Updating..." : "Saving..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="sm:w-5 sm:h-5" />
                        <span>{showEditTipModal ? "Update" : "Save"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-md border border-red-500/30">
              <div className="p-4 sm:p-6 border-b border-red-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle
                      className="text-red-400 sm:w-6 sm:h-6"
                      size={20}
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                    Confirm Delete
                  </h2>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base">
                    Are you sure you want to delete{" "}
                    {deleteType === "blog" && "this article"}
                    {deleteType === "case" && "this case study"}
                    {deleteType === "tip" && "this tip"}
                    {deleteTarget && (
                      <span className="font-bold text-whitePure">
                        {" "}
                        "{deleteTarget.title}"
                      </span>
                    )}
                    ?
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                      setDeleteType("");
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="sm:w-5 sm:h-5 animate-spin"
                        />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
