import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  Sparkles,
  Search,
  RefreshCw,
  Save,
  Package,
  Tag,
  FolderPlus,
  Folders,
  List,
  Grid3x3,
  AlertTriangle,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Briefcase,
  TrendingUp,
  Award,
  Users,
  Target,
  Crown,
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { MARKETING_ICONS } from "../utils/marketing";
import toast from "react-hot-toast";

export default function PortfolioDash() {
  // States for projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // States for categories
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [categoryColor, setCategoryColor] = useState(
    "from-emerald-500 to-teal-500",
  );

  // States for icon picker
  const [showIconModal, setShowIconModal] = useState(false);
  const [showCategoryIconModal, setShowCategoryIconModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Project form states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Client info
  const [clientName, setClientName] = useState("");
  const [clientIndustry, setClientIndustry] = useState("");
  const [clientLocation, setClientLocation] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [clientDescription, setClientDescription] = useState("");

  // Images and video
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  // Tags
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // Impact metrics
  const [metricValue, setMetricValue] = useState("");
  const [metricLabel, setMetricLabel] = useState("");
  const [metricDescription, setMetricDescription] = useState("");
  const [impactMetrics, setImpactMetrics] = useState([]);

  const [projectOrder, setProjectOrder] = useState(0);
  const [categoryOrder, setCategoryOrder] = useState(0);

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  // View mode
  const [viewMode, setViewMode] = useState("grid");

  // Color options for categories
  const colorOptions = [
    { name: "Emerald to Teal", value: "from-emerald-500 to-teal-500" },
    { name: "Lime to Emerald", value: "from-lime-500 to-emerald-500" },
    { name: "Emerald to Cyan", value: "from-emerald-500 to-cyan-500" },
    { name: "Teal to Emerald", value: "from-teal-500 to-emerald-500" },
    { name: "Emerald to Green", value: "from-emerald-500 to-green-500" },
    { name: "Lime to Teal", value: "from-lime-500 to-teal-500" },
    { name: "Emerald to Blue", value: "from-emerald-500 to-blue-500" },
    { name: "Purple to Pink", value: "from-purple-500 to-pink-500" },
    { name: "Blue to Cyan", value: "from-blue-500 to-cyan-500" },
    { name: "Orange to Red", value: "from-orange-500 to-red-500" },
  ];

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  // Generate unique category ID
  const generateCategoryId = (name) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    const nameSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${nameSlug}-${timestamp}${random}`;
  };

  // ============ CATEGORIES FUNCTIONS ============
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "portfolioCategories"),
      );
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      categoriesData.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        return orderA - orderB;
      });

      setCategories(categoriesData);
      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0].categoryId);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim() || !categoryIcon) {
      toast.error("Please fill category name and select an icon");
      return;
    }

    setLoading(true);
    try {
      const categoryId = generateCategoryId(categoryName);

      await addDoc(collection(db, "portfolioCategories"), {
        categoryId: categoryId,
        name: categoryName,
        icon: categoryIcon,
        color: categoryColor,
        order: parseInt(categoryOrder) || 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Category added successfully");
      resetCategoryForm();
      setShowCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!categoryName.trim() || !categoryIcon) {
      toast.error("Please fill category name and select an icon");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "portfolioCategories", editingCategory.id), {
        name: categoryName,
        icon: categoryIcon,
        color: categoryColor,
        order: parseInt(categoryOrder) || 0,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Category updated successfully");
      resetCategoryForm();
      setShowEditCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCategory = (category) => {
    setDeleteTarget(category);
    setDeleteType("category");
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;

    const category = deleteTarget;
    const categoryProjects = projects.filter(
      (proj) => proj.category === category.categoryId,
    );

    setLoading(true);
    try {
      for (const proj of categoryProjects) {
        await deleteDoc(doc(db, "portfolioProjects", proj.id));
      }

      await deleteDoc(doc(db, "portfolioCategories", category.id));

      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchCategories();
      fetchProjects();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryIcon(category.icon);
    setCategoryColor(category.color || "from-emerald-500 to-teal-500");
    setCategoryOrder(category.order || 0);
    setShowEditCategoryModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryIcon("");
    setCategoryColor("from-emerald-500 to-teal-500");
    setCategoryOrder(0);
    setEditingCategory(null);
  };

  // ============ PROJECTS FUNCTIONS ============
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "portfolioProjects"));
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      projectsData.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        return orderA - orderB;
      });

      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const resetProjectForm = () => {
    setProjectTitle("");
    setProjectDescription("");
    setClientName("");
    setClientIndustry("");
    setClientLocation("");
    setProjectDuration("");
    setClientDescription("");
    setImages([]);
    setImageUrl("");
    setVideoUrl("");
    setTags([]);
    setTagInput("");
    setImpactMetrics([]);
    setMetricValue("");
    setMetricLabel("");
    setMetricDescription("");
    setProjectOrder(0);
    setEditingProject(null);
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    if (!imageUrl.startsWith("http")) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setImages([...images, imageUrl]);
    setImageUrl("");
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, tagInput]);
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addMetric = () => {
    if (!metricValue || !metricLabel || !metricDescription) {
      toast.error("Please fill all metric fields");
      return;
    }
    setImpactMetrics([
      ...impactMetrics,
      {
        metric: metricValue,
        label: metricLabel,
        description: metricDescription,
        measurable: true,
      },
    ]);
    setMetricValue("");
    setMetricLabel("");
    setMetricDescription("");
  };

  const removeMetric = (index) => {
    setImpactMetrics(impactMetrics.filter((_, i) => i !== index));
  };

  const handleAddProject = async () => {
    if (
      !projectTitle ||
      !projectDescription ||
      !clientName ||
      images.length === 0 ||
      tags.length === 0 ||
      impactMetrics.length === 0 ||
      !selectedCategory
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const categoryData = categories.find(
        (c) => c.categoryId === selectedCategory,
      );

      await addDoc(collection(db, "portfolioProjects"), {
        category: selectedCategory,
        title: projectTitle,
        description: projectDescription,
        client: {
          name: clientName,
          industry: clientIndustry,
          location: clientLocation,
          duration: projectDuration,
          description: clientDescription,
        },
        images: images,
        video: videoUrl || null,
        tags: tags,
        impact: impactMetrics,
        color: categoryData?.color || "from-emerald-500 to-teal-500",
        order: parseInt(projectOrder) || 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Project added successfully");
      resetProjectForm();
      setShowAddProjectModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Error adding project");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async () => {
    if (
      !projectTitle ||
      !projectDescription ||
      !clientName ||
      images.length === 0 ||
      tags.length === 0 ||
      impactMetrics.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const categoryData = categories.find(
        (c) => c.categoryId === selectedCategory,
      );

      await updateDoc(doc(db, "portfolioProjects", editingProject.id), {
        category: selectedCategory,
        title: projectTitle,
        description: projectDescription,
        client: {
          name: clientName,
          industry: clientIndustry,
          location: clientLocation,
          duration: projectDuration,
          description: clientDescription,
        },
        images: images,
        video: videoUrl || null,
        tags: tags,
        impact: impactMetrics,
        color: categoryData?.color || "from-emerald-500 to-teal-500",
        order: parseInt(projectOrder) || 0,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Project updated successfully");
      resetProjectForm();
      setShowEditProjectModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Error updating project");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteProject = (project) => {
    setDeleteTarget(project);
    setDeleteType("project");
    setShowDeleteModal(true);
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "portfolioProjects", deleteTarget.id));
      toast.success("Project deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
    } finally {
      setLoading(false);
    }
  };

  const openEditProjectModal = (project) => {
    setEditingProject(project);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setClientName(project.client.name);
    setClientIndustry(project.client.industry);
    setClientLocation(project.client.location);
    setProjectDuration(project.client.duration);
    setClientDescription(project.client.description);
    setImages(project.images);
    setVideoUrl(project.video || "");
    setTags(project.tags);
    setImpactMetrics(project.impact);
    setSelectedCategory(project.category);
    setProjectOrder(project.order || 0);
    setShowEditProjectModal(true);
  };

  // ============ HELPER FUNCTIONS ============
  const filteredIcons = MARKETING_ICONS.filter(
    ({ name, category }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getIconComponent = (iconName) => {
    const iconData = MARKETING_ICONS.find((i) => i.name === iconName);
    return iconData?.icon || Sparkles;
  };

  const SelectedCategoryIconComponent = categoryIcon
    ? getIconComponent(categoryIcon)
    : null;

  const getProjectsByCategory = (categoryId) => {
    return projects.filter((proj) => proj.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-bodyBg py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-whitePure mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                <Briefcase className="text-primary" size={28} />
                <span>Portfolio Dashboard</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Manage portfolio projects and categories
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
              <button
                onClick={() => {
                  resetCategoryForm();
                  setShowCategoryModal(true);
                }}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FolderPlus size={18} className="sm:w-5 sm:h-5" />
                <span>Add Category</span>
              </button>
              <button
                onClick={() => {
                  if (categories.length === 0) {
                    toast.error("Please add a category first");
                    return;
                  }
                  resetProjectForm();
                  setSelectedCategory(categories[0].categoryId);
                  setShowAddProjectModal(true);
                }}
                className="bg-gradient-to-r from-primary to-primary-neon text-blackPure px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span>Add Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-cardBg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  Projects
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {projects.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Briefcase className="text-primary" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-cardBg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  Categories
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {categories.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Folders className="text-cyan-400" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-cardBg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  Total Images
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {projects.reduce(
                    (acc, p) => acc + (p.images?.length || 0),
                    0,
                  )}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="text-purple-400" size={20} />
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

        {/* Categories Management Section */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-primary/20">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-whitePure flex items-center gap-2">
              <Folders className="text-cyan-400" size={20} />
              <span className="hidden sm:inline">Categories Management</span>
              <span className="sm:hidden">Categories</span>
            </h2>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {categories.map((category) => {
                const categoryProjectCount = getProjectsByCategory(
                  category.categoryId,
                ).length;
                const CategoryIconComp = getIconComponent(category.icon);
                return (
                  <div
                    key={category.id}
                    className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 hover:border-cyan-500/30 transition group relative"
                  >
                    <div className="text-center">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}
                      >
                        <CategoryIconComp className="text-white" size={20} />
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-whitePure mb-1 truncate">
                        {category.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
                        {categoryProjectCount} project
                        {categoryProjectCount !== 1 ? "s" : ""}
                      </p>
                      <div className="flex gap-1.5 sm:gap-2 justify-center">
                        <button
                          onClick={() => openEditCategoryModal(category)}
                          className="p-1 sm:p-1.5 bg-primary/20 rounded-md sm:rounded-lg hover:bg-primary/30 transition text-primary"
                        >
                          <Edit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDeleteCategory(category)}
                          className="p-1 sm:p-1.5 bg-red-500/20 rounded-md sm:rounded-lg hover:bg-red-500/30 transition text-red-400"
                        >
                          <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-400">
              <Folders className="mx-auto mb-2 sm:mb-3 opacity-50" size={40} />
              <p className="text-sm sm:text-base">
                No categories yet. Add your first category!
              </p>
            </div>
          )}
        </div>

        {/* Projects by Category */}
        {loading && projects.length === 0 ? (
          <div className="bg-cardBg rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-primary/20">
            <RefreshCw
              className="mx-auto text-primary animate-spin mb-3 sm:mb-4"
              size={40}
            />
            <p className="text-gray-400 text-sm sm:text-base">
              Loading projects...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-cardBg rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-primary/20">
            <Folders className="mx-auto text-gray-500 mb-3 sm:mb-4" size={48} />
            <h3 className="text-lg sm:text-xl font-bold text-whitePure mb-2">
              No categories yet
            </h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Start by adding your first category
            </p>
            <button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryModal(true);
              }}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <FolderPlus size={18} className="sm:w-5 sm:h-5" />
              Add First Category
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {categories.map((category) => {
              const categoryProjects = getProjectsByCategory(
                category.categoryId,
              );
              const CategoryIconComp = getIconComponent(category.icon);

              return (
                <div
                  key={category.id}
                  className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <CategoryIconComp
                        className="text-white sm:w-5 sm:h-5"
                        size={16}
                      />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-bold text-whitePure truncate">
                      {category.name}
                    </h2>
                    <span className="bg-primary/20 text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                      {categoryProjects.length} project
                      {categoryProjects.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {categoryProjects.length > 0 ? (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                          : "space-y-2 sm:space-y-3"
                      }
                    >
                      {categoryProjects.map((project) => {
                        if (viewMode === "list") {
                          return (
                            <div
                              key={project.id}
                              className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 hover:border-primary/30 transition"
                            >
                              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                                <div className="w-full xs:w-24 sm:w-32 h-20 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm sm:text-lg font-bold text-whitePure mb-1 truncate">
                                    {project.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-2">
                                    {project.client.name} •{" "}
                                    {project.client.location}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{project.images.length} images</span>
                                    {project.video && <span>• Video</span>}
                                    <span>
                                      • {project.impact.length} metrics
                                    </span>
                                  </div>
                                </div>
                                <div className="flex xs:flex-col gap-2 justify-end xs:justify-start">
                                  <button
                                    onClick={() =>
                                      openEditProjectModal(project)
                                    }
                                    className="p-1.5 sm:p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition text-primary"
                                  >
                                    <Edit2
                                      size={14}
                                      className="sm:w-4 sm:h-4"
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteProject(project)
                                    }
                                    className="p-1.5 sm:p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-red-400"
                                  >
                                    <Trash2
                                      size={14}
                                      className="sm:w-4 sm:h-4"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={project.id}
                            className="bg-grayLight rounded-lg sm:rounded-xl overflow-hidden border border-primary/10 hover:border-primary/30 transition group"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={project.images[0]}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div
                                className={`absolute top-2 left-2 bg-gradient-to-r ${project.color} px-2 py-1 rounded-full text-xs font-semibold text-blackPure`}
                              >
                                {category.name}
                              </div>
                              <div className="absolute top-2 right-2 bg-blackPure/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-whitePure flex items-center gap-1">
                                <ImageIcon size={12} />
                                {project.images.length}
                                {project.video && (
                                  <>
                                    {" "}
                                    + <Video size={12} />
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="p-3 sm:p-4">
                              <div className="text-primary-light text-xs font-semibold mb-1">
                                {project.client.name}
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-whitePure mb-2 line-clamp-2">
                                {project.title}
                              </h3>

                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <MapPin size={12} />
                                <span>{project.client.location}</span>
                                <span>•</span>
                                <Calendar size={12} />
                                <span>{project.client.duration}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {project.impact.slice(0, 2).map((imp, i) => (
                                  <div
                                    key={i}
                                    className="bg-primary/5 border border-primary/10 rounded-lg p-2"
                                  >
                                    <div className="text-primary font-bold text-xs">
                                      {imp.metric}
                                    </div>
                                    <div className="text-gray-500 text-[10px] line-clamp-1">
                                      {imp.label}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2 pt-2 border-t border-primary/10">
                                <button
                                  onClick={() => openEditProjectModal(project)}
                                  className="flex-1 p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition text-primary text-sm font-semibold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => confirmDeleteProject(project)}
                                  className="flex-1 p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-red-400 text-sm font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-400">
                      <Briefcase
                        className="mx-auto mb-2 sm:mb-3 opacity-50"
                        size={40}
                      />
                      <p className="text-sm sm:text-base">
                        No projects in this category yet
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-2xl border border-primary/20 max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-primary/20 flex items-center justify-between sticky top-0 bg-cardBg z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                  Add New Category
                </h2>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="text-gray-400 hover:text-whitePure transition"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., E-commerce"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Category Icon
                  </label>
                  <button
                    onClick={() => setShowCategoryIconModal(true)}
                    className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition flex items-center justify-center gap-3"
                  >
                    {SelectedCategoryIconComponent ? (
                      <>
                        <SelectedCategoryIconComponent
                          size={20}
                          className="sm:w-6 sm:h-6 text-cyan-400"
                        />
                        <span className="text-sm sm:text-base">
                          Change Icon
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles
                          size={20}
                          className="sm:w-6 sm:h-6 text-cyan-400"
                        />
                        <span className="text-sm sm:text-base">
                          Select Icon
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Color Gradient
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setCategoryColor(color.value)}
                        className={`p-3 rounded-lg flex items-center gap-2 transition ${
                          categoryColor === color.value
                            ? "ring-2 ring-primary"
                            : "hover:ring-2 hover:ring-primary/50"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${color.value}`}
                        ></div>
                        <span className="text-xs text-whitePure">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryOrder}
                    onChange={(e) => setCategoryOrder(e.target.value)}
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
                      setShowCategoryModal(false);
                      resetCategoryForm();
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="sm:w-5 sm:h-5 animate-spin"
                        />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="sm:w-5 sm:h-5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal - Similar to Add Category Modal */}
        {showEditCategoryModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-2xl border border-primary/20 max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-primary/20 flex items-center justify-between sticky top-0 bg-cardBg z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                  Edit Category
                </h2>
                <button
                  onClick={() => {
                    setShowEditCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="text-gray-400 hover:text-whitePure transition"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., E-commerce"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Category Icon
                  </label>
                  <button
                    onClick={() => setShowCategoryIconModal(true)}
                    className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition flex items-center justify-center gap-3"
                  >
                    {SelectedCategoryIconComponent ? (
                      <>
                        <SelectedCategoryIconComponent
                          size={20}
                          className="sm:w-6 sm:h-6 text-cyan-400"
                        />
                        <span className="text-sm sm:text-base">
                          Change Icon
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles
                          size={20}
                          className="sm:w-6 sm:h-6 text-cyan-400"
                        />
                        <span className="text-sm sm:text-base">
                          Select Icon
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Color Gradient
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setCategoryColor(color.value)}
                        className={`p-3 rounded-lg flex items-center gap-2 transition ${
                          categoryColor === color.value
                            ? "ring-2 ring-primary"
                            : "hover:ring-2 hover:ring-primary/50"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${color.value}`}
                        ></div>
                        <span className="text-xs text-whitePure truncate">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryOrder}
                    onChange={(e) => setCategoryOrder(e.target.value)}
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
                      setShowEditCategoryModal(false);
                      resetCategoryForm();
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditCategory}
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="sm:w-5 sm:h-5 animate-spin"
                        />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="sm:w-5 sm:h-5" />
                        <span>Update</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Icon Picker Modal */}
        {showCategoryIconModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-primary/20 gap-3">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-whitePure mb-2 sm:mb-3">
                    Select Category Icon
                  </h2>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search icons..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCategoryIconModal(false);
                    setSearchQuery("");
                  }}
                  className="self-end sm:self-auto text-whitePure hover:text-primary transition"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
                  {filteredIcons.map(({ name, icon: Icon, category }) => (
                    <button
                      key={name}
                      onClick={() => {
                        setCategoryIcon(name);
                        setShowCategoryIconModal(false);
                        setSearchQuery("");
                      }}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center justify-center transition relative group ${
                        categoryIcon === name
                          ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white ring-2 ring-cyan-400"
                          : "bg-grayLight text-whitePure hover:bg-cyan-500/20"
                      }`}
                      title={`${name} - ${category}`}
                    >
                      <Icon size={20} className="sm:w-6 sm:h-6" />
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-blackPure text-whitePure text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {name}
                      </div>
                    </button>
                  ))}
                </div>

                {filteredIcons.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-500">
                    <Search
                      size={40}
                      className="sm:w-12 sm:h-12 mx-auto mb-3 opacity-50"
                    />
                    <p className="text-sm sm:text-base">No icons found</p>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4 border-t border-primary/20">
                <p className="text-xs sm:text-sm text-gray-400 text-center">
                  {filteredIcons.length} icons available
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Project Modal - PART 1/2 */}
        {(showAddProjectModal || showEditProjectModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-primary/20">
              <div className="sticky top-0 bg-cardBg border-b border-primary/20 p-4 sm:p-6 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                  {showEditProjectModal ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddProjectModal(false);
                    setShowEditProjectModal(false);
                    resetProjectForm();
                  }}
                  className="text-gray-400 hover:text-whitePure transition"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {categories.map((cat) => {
                      const CatIcon = getIconComponent(cat.icon);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.categoryId)}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl font-semibold transition flex items-center justify-center gap-2 text-xs sm:text-sm ${
                            selectedCategory === cat.categoryId
                              ? `bg-gradient-to-r ${cat.color} text-white`
                              : "bg-grayLight text-whitePure hover:bg-grayDark"
                          }`}
                        >
                          <CatIcon size={16} className="sm:w-4 sm:h-4" />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project Title */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g., TechVision E-commerce Platform"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Project Description *
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Complete brand redesign and e-commerce platform development..."
                    rows={3}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base resize-none"
                  />
                </div>

                {/* Client Information Section */}
                <div className="border border-primary/20 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-whitePure mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    Client Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-whitePure">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g., TechVision Electronics"
                        className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-whitePure">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={clientIndustry}
                        onChange={(e) => setClientIndustry(e.target.value)}
                        placeholder="e.g., Retail & E-commerce"
                        className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-whitePure">
                        Location
                      </label>
                      <input
                        type="text"
                        value={clientLocation}
                        onChange={(e) => setClientLocation(e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                        className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-whitePure">
                        Project Duration (in months)
                      </label>

                      <input
                        type="number"
                        value={projectDuration}
                        onChange={(e) => setProjectDuration(e.target.value)}
                        placeholder="e.g., 6"
                        min="1"
                        className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />

                      <p className="text-xs text-gray-400 mt-1">
                        Enter number of months only
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Client Background/Challenge
                    </label>
                    <textarea
                      value={clientDescription}
                      onChange={(e) => setClientDescription(e.target.value)}
                      placeholder="A mid-sized electronics retailer looking to modernize their online presence..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div className="border border-primary/20 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-whitePure mb-4 flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" />
                    Project Images * (at least 1)
                  </h3>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL (Unsplash, Imgur, etc.)"
                      className="flex-1 px-2 py-2 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      onClick={addImage}
                      className="bg-primary px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg text-blackPure hover:bg-primary-dark
                       transition flex items-center gap-1 sm:gap-2 font-semibold text-sm"
                    >
                      <Plus size={12} />
                      Add
                    </button>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative group aspect-video rounded-lg overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`Project ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={14} />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-blackPure/60 px-2 py-0.5 rounded text-xs text-white">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Project Video URL (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-primary flex-shrink-0" />
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g., https://www.youtube.com/embed/..."
                      className="flex-1 px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Use YouTube embed URL format
                  </p>
                </div>

                {/* Tags */}
                <div className="border border-primary/20 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-whitePure mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-primary" />
                    Tags * (at least 1)
                  </h3>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      placeholder="e.g., Web Design (press Enter)"
                      className="flex-1 px-2 py-2 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      onClick={addTag}
                      className="bg-primary  px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg text-blackPure
                       hover:bg-primary-dark transition flex items-center gap-1 sm:gap-2 font-semibold text-sm"
                    >
                      <Plus size={12} />
                      Add
                    </button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2 group"
                        >
                          <span className="text-primary text-sm font-semibold">
                            {tag}
                          </span>
                          <button
                            onClick={() => removeTag(index)}
                            className="text-red-400 hover:text-red-500 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Impact Metrics */}
                <div className="border border-primary/20 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-whitePure mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Impact Metrics * (at least 1)
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <input
                        type="text"
                        value={metricValue}
                        onChange={(e) => setMetricValue(e.target.value)}
                        placeholder="Metric Value (e.g., 187%, EGP 25K, 42%)"
                        className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={metricLabel}
                        onChange={(e) => setMetricLabel(e.target.value)}
                        placeholder="Metric Label (e.g., Increase in Online Sales)"
                        className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={metricDescription}
                        onChange={(e) => setMetricDescription(e.target.value)}
                        placeholder="Description (e.g., From EGP 15K to EGP 43K monthly revenue)"
                        className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <button
                      onClick={addMetric}
                      className="w-full bg-primary px-4 py-2.5 rounded-lg text-blackPure hover:bg-primary-dark transition flex items-center justify-center gap-2 font-semibold text-sm"
                    >
                      <Plus size={16} />
                      Add Metric
                    </button>
                  </div>

                  {impactMetrics.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {impactMetrics.map((metric, index) => (
                        <div
                          key={index}
                          className="bg-grayLight rounded-lg p-3 group hover:bg-grayDark transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-neon">
                              {metric.metric}
                            </div>
                            <button
                              onClick={() => removeMetric(index)}
                              className="text-red-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="text-sm font-semibold text-whitePure mb-1">
                            {metric.label}
                          </div>
                          <div className="text-xs text-gray-400">
                            {metric.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display Order */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-whitePure">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={projectOrder}
                    onChange={(e) => setProjectOrder(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers appear first in the same category (0 = first)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddProjectModal(false);
                      setShowEditProjectModal(false);
                      resetProjectForm();
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      showEditProjectModal
                        ? handleEditProject
                        : handleAddProject
                    }
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary-neon text-blackPure font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="sm:w-5 sm:h-5 animate-spin"
                        />
                        <span>
                          {showEditProjectModal ? "Updating..." : "Saving..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="sm:w-5 sm:h-5" />
                        <span>{showEditProjectModal ? "Update" : "Save"}</span>
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
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
                {deleteType === "category" && deleteTarget && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm sm:text-base">
                      Are you sure you want to delete the category{" "}
                      <span className="font-bold text-whitePure">
                        "{deleteTarget.name}"
                      </span>
                      ?
                    </p>
                    {projects.filter(
                      (proj) => proj.category === deleteTarget.categoryId,
                    ).length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <p className="text-red-400 font-semibold mb-2 text-sm sm:text-base">
                          ⚠️ Warning
                        </p>
                        <p className="text-gray-300 text-xs sm:text-sm">
                          This category contains{" "}
                          <span className="font-bold text-red-400">
                            {
                              projects.filter(
                                (proj) =>
                                  proj.category === deleteTarget.categoryId,
                              ).length
                            }
                          </span>{" "}
                          project(s). All projects will be permanently deleted.
                        </p>
                      </div>
                    )}
                    <p className="text-gray-400 text-xs sm:text-sm">
                      This action cannot be undone.
                    </p>
                  </div>
                )}

                {deleteType === "project" && deleteTarget && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm sm:text-base">
                      Are you sure you want to delete the project{" "}
                      <span className="font-bold text-whitePure">
                        "{deleteTarget.title}"
                      </span>
                      ?
                    </p>
                    <div className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Client:</span>
                        <span className="text-whitePure font-semibold">
                          {deleteTarget.client?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Images:</span>
                        <span className="text-whitePure">
                          {deleteTarget.images?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Metrics:</span>
                        <span className="text-whitePure">
                          {deleteTarget.impact?.length || 0}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      This action cannot be undone.
                    </p>
                  </div>
                )}

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
                    onClick={
                      deleteType === "category"
                        ? handleDeleteCategory
                        : handleDeleteProject
                    }
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
