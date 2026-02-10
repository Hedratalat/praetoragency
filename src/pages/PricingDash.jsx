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
  Zap,
  Crown,
  Save,
  Package,
  Tag,
  FolderPlus,
  Folders,
  List,
  Grid3x3,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
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

export default function PricingDash() {
  // States for packages
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showEditPackageModal, setShowEditPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // States for categories
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");

  // States for icon picker
  const [showIconModal, setShowIconModal] = useState(false);
  const [showCategoryIconModal, setShowCategoryIconModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Package form states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Sparkles");
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [isPopular, setIsPopular] = useState(false);

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  // View mode
  const [viewMode, setViewMode] = useState("grid");

  // order
  const [categoryOrder, setCategoryOrder] = useState(0);
  const [packageOrder, setPackageOrder] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchPackages();
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
  // ============ CATEGORIES FUNCTIONS ============
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by order - الي عنده order الأول، الي مافيش ليه order آخر حاجة
      categoriesData.sort((a, b) => {
        const orderA = a.order ?? Infinity; // لو مافيش order يروح آخر حاجة
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

      await addDoc(collection(db, "categories"), {
        categoryId: categoryId,
        name: categoryName,
        icon: categoryIcon,
        order: parseInt(categoryOrder) || 0, // إضافة order
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
      await updateDoc(doc(db, "categories", editingCategory.id), {
        name: categoryName,
        icon: categoryIcon,
        order: parseInt(categoryOrder) || 0, // إضافة order
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
    const categoryPackages = packages.filter(
      (pkg) => pkg.category === category.categoryId,
    );

    setLoading(true);
    try {
      for (const pkg of categoryPackages) {
        await deleteDoc(doc(db, "pricing", pkg.id));
      }

      await deleteDoc(doc(db, "categories", category.id));

      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchCategories();
      fetchPackages();
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
    setCategoryOrder(category.order || 0);
    setShowEditCategoryModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryIcon("");
    setCategoryOrder(0);
    setEditingCategory(null);
  };

  // ============ PACKAGES FUNCTIONS ============
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "pricing"));
      const packagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      packagesData.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        return orderA - orderB;
      });

      setPackages(packagesData);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const resetPackageForm = () => {
    setPackageName("");
    setPrice("");
    setFeatures([]);
    setSelectedIcon("Sparkles");
    setIsPopular(false);
    setPackageOrder(0);
    setFeatureInput("");
    setEditingPackage(null);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput]);
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddPackage = async () => {
    if (!packageName || !price || features.length === 0 || !selectedCategory) {
      toast.error("Please fill all fields and add at least one feature");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "pricing"), {
        category: selectedCategory,
        name: packageName,
        price: price,
        icon: selectedIcon,
        features: features,
        popular: isPopular,
        order: parseInt(packageOrder) || 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Package added successfully");
      resetPackageForm();
      setShowAddPackageModal(false);
      fetchPackages();
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Error adding package");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPackage = async () => {
    if (!packageName || !price || features.length === 0) {
      toast.error("Please fill all fields and add at least one feature");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "pricing", editingPackage.id), {
        category: selectedCategory,
        name: packageName,
        price: price,
        icon: selectedIcon,
        features: features,
        popular: isPopular,
        order: parseInt(packageOrder) || 0,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Package updated successfully");
      resetPackageForm();
      setShowEditPackageModal(false);
      fetchPackages();
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error("Error updating package");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePackage = (pkg) => {
    setDeleteTarget(pkg);
    setDeleteType("package");
    setShowDeleteModal(true);
  };

  const handleDeletePackage = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "pricing", deleteTarget.id));
      toast.success("Package deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Error deleting package");
    } finally {
      setLoading(false);
    }
  };

  const openEditPackageModal = (pkg) => {
    setEditingPackage(pkg);
    setPackageName(pkg.name);
    setPrice(pkg.price);
    setFeatures(pkg.features);
    setSelectedIcon(pkg.icon);
    setSelectedCategory(pkg.category);
    setIsPopular(pkg.popular || false);
    setPackageOrder(pkg.order || 0);
    setShowEditPackageModal(true);
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

  const SelectedIconComponent = getIconComponent(selectedIcon);
  const SelectedCategoryIconComponent = categoryIcon
    ? getIconComponent(categoryIcon)
    : null;

  const getPackagesByCategory = (categoryId) => {
    return packages.filter((pkg) => pkg.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-bodyBg py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-whitePure mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                <Package className="text-primary" size={28} />
                <span>Pricing </span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Manage packages and categories
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
                  resetPackageForm();
                  setSelectedCategory(categories[0].categoryId);
                  setShowAddPackageModal(true);
                }}
                className="bg-gradient-to-r from-primary to-primary-neon text-blackPure px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span>Add Package</span>
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
                  Packages
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {packages.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Package className="text-primary" size={20} />
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
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Popular</p>
                <p className="text-2xl sm:text-3xl font-bold text-whitePure">
                  {packages.filter((p) => p.popular).length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Crown className="text-yellow-400" size={20} />
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
                const categoryPackageCount = getPackagesByCategory(
                  category.categoryId,
                ).length;
                const CategoryIconComp = getIconComponent(category.icon);
                return (
                  <div
                    key={category.id}
                    className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 hover:border-cyan-500/30 transition group relative"
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <CategoryIconComp className="text-white" size={20} />
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-whitePure mb-1 truncate">
                        {category.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
                        {categoryPackageCount} pkg
                        {categoryPackageCount !== 1 ? "s" : ""}
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

        {/* Packages by Category */}
        {loading && packages.length === 0 ? (
          <div className="bg-cardBg rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-primary/20">
            <RefreshCw
              className="mx-auto text-primary animate-spin mb-3 sm:mb-4"
              size={40}
            />
            <p className="text-gray-400 text-sm sm:text-base">
              Loading packages...
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
              const categoryPackages = getPackagesByCategory(
                category.categoryId,
              );
              const CategoryIconComp = getIconComponent(category.icon);

              return (
                <div
                  key={category.id}
                  className="bg-cardBg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CategoryIconComp
                        className="text-white sm:w-5 sm:h-5"
                        size={16}
                      />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-bold text-whitePure truncate">
                      {category.name}
                    </h2>
                    <span className="bg-primary/20 text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                      {categoryPackages.length} pkg
                      {categoryPackages.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {categoryPackages.length > 0 ? (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                          : "space-y-2 sm:space-y-3"
                      }
                    >
                      {categoryPackages.map((pkg) => {
                        const IconComponent = getIconComponent(pkg.icon);

                        if (viewMode === "list") {
                          return (
                            <div
                              key={pkg.id}
                              className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 hover:border-primary/30 transition flex flex-col xs:flex-row xs:items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-neon rounded-lg flex items-center justify-center flex-shrink-0">
                                  <IconComponent
                                    className="text-blackPure"
                                    size={20}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm sm:text-lg font-bold text-whitePure truncate">
                                      {pkg.name}
                                    </h3>
                                    {pkg.popular && (
                                      <span className="bg-gradient-to-r from-primary to-primary-neon text-blackPure px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-400 text-xs sm:text-sm">
                                    {pkg.features.length} features
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                                    EGP {pkg.price}
                                  </p>
                                  <p className="text-gray-400 text-[10px] sm:text-xs">
                                    /month
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end xs:justify-start">
                                <button
                                  onClick={() => openEditPackageModal(pkg)}
                                  className="p-1.5 sm:p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition text-primary"
                                >
                                  <Edit2 size={14} className="sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => confirmDeletePackage(pkg)}
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
                            key={pkg.id}
                            className="bg-grayLight rounded-lg sm:rounded-xl p-4 sm:p-6 border border-primary/10 hover:border-primary/30 transition group relative"
                          >
                            {pkg.popular && (
                              <div className="absolute -top-2 sm:-top-3 right-3 sm:right-4">
                                <span className="bg-gradient-to-r from-primary to-primary-neon text-blackPure px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                                  Popular
                                </span>
                              </div>
                            )}

                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-neon rounded-lg flex items-center justify-center">
                                <IconComponent
                                  className="text-blackPure"
                                  size={20}
                                />
                              </div>
                              <div className="flex gap-1.5 sm:gap-2">
                                <button
                                  onClick={() => openEditPackageModal(pkg)}
                                  className="p-1.5 sm:p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition text-primary"
                                >
                                  <Edit2 size={14} className="sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => confirmDeletePackage(pkg)}
                                  className="p-1.5 sm:p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-red-400"
                                >
                                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            </div>

                            <h3 className="text-base sm:text-xl font-bold text-whitePure mb-2">
                              {pkg.name}
                            </h3>

                            <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                                EGP {pkg.price}
                              </span>
                              <span className="text-gray-400 text-sm">
                                /month
                              </span>
                            </div>

                            <div className="h-px bg-primary/20 mb-3 sm:mb-4"></div>

                            <div className="space-y-1.5 sm:space-y-2">
                              {pkg.features.slice(0, 4).map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle
                                    className="text-primary mt-0.5 flex-shrink-0 sm:w-4 sm:h-4"
                                    size={14}
                                  />
                                  <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                              {pkg.features.length > 4 && (
                                <p className="text-primary text-xs sm:text-sm font-semibold">
                                  +{pkg.features.length - 4} more features
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-400">
                      <Package
                        className="mx-auto mb-2 sm:mb-3 opacity-50"
                        size={40}
                      />
                      <p className="text-sm sm:text-base">
                        No packages in this category yet
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
                    placeholder="e.g., Social Media Marketing"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    ID will be generated automatically
                  </p>
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

        {/* Edit Category Modal */}
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
                    placeholder="e.g., Social Media Marketing"
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

        {/* Add/Edit Package Modal */}
        {(showAddPackageModal || showEditPackageModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-primary/20">
              <div className="sticky top-0 bg-cardBg border-b border-primary/20 p-4 sm:p-6 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-whitePure">
                  {showEditPackageModal ? "Edit Package" : "Add New Package"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddPackageModal(false);
                    setShowEditPackageModal(false);
                    resetPackageForm();
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
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {categories.map((cat) => {
                      const CatIcon = getIconComponent(cat.icon);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.categoryId)}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base ${
                            selectedCategory === cat.categoryId
                              ? "bg-gradient-to-r from-primary to-primary-neon text-blackPure"
                              : "bg-grayLight text-whitePure hover:bg-grayDark"
                          }`}
                        >
                          <CatIcon size={18} className="sm:w-5 sm:h-5" />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Package Icon
                  </label>
                  <button
                    onClick={() => setShowIconModal(true)}
                    className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition flex items-center justify-center gap-3"
                  >
                    <SelectedIconComponent
                      size={20}
                      className="sm:w-6 sm:h-6 text-primary"
                    />
                    <span className="text-sm sm:text-base">Change Icon</span>
                  </button>
                </div>

                {/* Package Name */}
                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="e.g., Professional Package"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Price (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">
                      EGP
                    </span>

                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="299"
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Popular Toggle */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-grayLight rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Crown
                      className="text-primary flex-shrink-0 sm:w-6 sm:h-6"
                      size={20}
                    />
                    <div>
                      <p className="font-semibold text-whitePure text-sm sm:text-base">
                        Mark as Popular
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Highlight this package
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPopular(!isPopular)}
                    className={`relative w-12 h-7 sm:w-14 sm:h-8 rounded-full transition flex-shrink-0 ${
                      isPopular ? "bg-primary" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition transform ${
                        isPopular
                          ? "translate-x-6 sm:translate-x-7"
                          : "translate-x-1"
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Features */}
                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Package Features
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      placeholder="Add a feature (press Enter)"
                      className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                    <button
                      onClick={addFeature}
                      className="bg-primary px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-blackPure hover:bg-primary-dark transition flex items-center justify-center flex-shrink-0"
                    >
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-grayLight px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl group hover:bg-grayDark transition"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <CheckCircle
                              size={14}
                              className="sm:w-4 sm:h-4 text-primary flex-shrink-0"
                            />
                            <span className="text-whitePure text-sm sm:text-base truncate">
                              {feature}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-red-400 hover:text-red-500 transition flex-shrink-0 ml-2"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-2 sm:mb-3 text-sm font-medium text-whitePure">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={packageOrder}
                    onChange={(e) => setPackageOrder(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers appear first in the same category (0 = first)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddPackageModal(false);
                      setShowEditPackageModal(false);
                      resetPackageForm();
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      showEditPackageModal
                        ? handleEditPackage
                        : handleAddPackage
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
                          {showEditPackageModal ? "Updating..." : "Saving..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="sm:w-5 sm:h-5" />
                        <span>{showEditPackageModal ? "Update" : "Save"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Package Icon Modal */}
        {showIconModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-primary/20 gap-3">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-whitePure mb-2 sm:mb-3">
                    Select Package Icon
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
                    setShowIconModal(false);
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
                        setSelectedIcon(name);
                        setShowIconModal(false);
                        setSearchQuery("");
                      }}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center justify-center transition relative group ${
                        selectedIcon === name
                          ? "bg-gradient-to-r from-primary to-primary-neon text-blackPure ring-2 ring-primary"
                          : "bg-grayLight text-whitePure hover:bg-primary/20"
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-cardBg rounded-xl sm:rounded-2xl w-full max-w-md border border-red-500/30">
              <div className="p-4 sm:p-6 border-b border-red-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle
                      className="text-red-400 sm:w-6 sm:h-6 "
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
                    {packages.filter(
                      (pkg) => pkg.category === deleteTarget.categoryId,
                    ).length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <p className="text-red-400 font-semibold mb-2 text-sm sm:text-base">
                          ⚠️ Warning
                        </p>
                        <p className="text-gray-300 text-xs sm:text-sm">
                          This category contains{" "}
                          <span className="font-bold text-red-400">
                            {
                              packages.filter(
                                (pkg) =>
                                  pkg.category === deleteTarget.categoryId,
                              ).length
                            }
                          </span>{" "}
                          package(s). All packages will be permanently deleted.
                        </p>
                      </div>
                    )}
                    <p className="text-gray-400 text-xs sm:text-sm">
                      This action cannot be undone.
                    </p>
                  </div>
                )}

                {deleteType === "package" && deleteTarget && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm sm:text-base">
                      Are you sure you want to delete the package{" "}
                      <span className="font-bold text-whitePure">
                        "{deleteTarget.name}"
                      </span>
                      ?
                    </p>
                    <div className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs sm:text-sm">
                          Price:
                        </span>
                        <span className="text-primary font-bold text-sm sm:text-base">
                          EGP {deleteTarget.price}/month
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs sm:text-sm">
                          Features:
                        </span>
                        <span className="text-whitePure text-sm sm:text-base">
                          {deleteTarget.features?.length || 0}
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
                        : handleDeletePackage
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
