import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Trash2,
  Edit,
  X,
  CheckCircle,
  Plus,
  Search,
  Sparkles,
  Image,
  HelpCircle,
  Loader,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { MARKETING_ICONS } from "../utils/marketing";
import toast from "react-hot-toast";

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit form states
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [serviceExplanation, setServiceExplanation] = useState("");
  const [packageContentInput, setPackageContentInput] = useState("");
  const [packageContent, setPackageContent] = useState([]);
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [beforeImageUrl, setBeforeImageUrl] = useState("");
  const [afterImageUrl, setAfterImageUrl] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqs, setFaqs] = useState([]);

  // Fetch all services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const servicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  // Delete service
  const handleDelete = (service) => {
    setDeleteTarget(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "services", deleteTarget.id));
      toast.success("Service deleted successfully");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleEdit = (service) => {
    setEditingService(service);
    setSelectedIcon(service.icon || null);
    setTitle(service.title || "");
    setDescription(service.description || "");
    setFeatures(service.features || []);
    setHeroTitle(service.hero?.title || "");
    setHeroSubtitle(service.hero?.subtitle || "");
    setHeroImageUrl(service.hero?.imageUrl || "");
    setServiceExplanation(service.explanation || "");
    setPackageContent(service.packageContent || []);
    setBeforeText(service.beforeAfter?.before?.text || "");
    setAfterText(service.beforeAfter?.after?.text || "");
    setBeforeImageUrl(service.beforeAfter?.before?.imageUrl || "");
    setAfterImageUrl(service.beforeAfter?.after?.imageUrl || "");
    setFaqs(service.faqs || []);
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingService(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setSelectedIcon(null);
    setTitle("");
    setDescription("");
    setFeatures([]);
    setHeroTitle("");
    setHeroSubtitle("");
    setHeroImageUrl("");
    setServiceExplanation("");
    setPackageContent([]);
    setBeforeText("");
    setAfterText("");
    setBeforeImageUrl("");
    setAfterImageUrl("");
    setFaqs([]);
    setFeatureInput("");
    setPackageContentInput("");
    setFaqQuestion("");
    setFaqAnswer("");
  };

  // Save edited service
  const handleSaveEdit = async () => {
    if (!selectedIcon || !title || !description || features.length === 0) {
      toast.error(
        "Please fill all required fields (icon, title, description, and at least one feature)",
      );
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "services", editingService.id), {
        icon: selectedIcon,
        title: title,
        description: description,
        features: features,
        hero: {
          title: heroTitle,
          subtitle: heroSubtitle,
          imageUrl: heroImageUrl,
        },
        explanation: serviceExplanation,
        packageContent: packageContent,
        beforeAfter: {
          before: {
            text: beforeText,
            imageUrl: beforeImageUrl,
          },
          after: {
            text: afterText,
            imageUrl: afterImageUrl,
          },
        },
        faqs: faqs,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Service updated successfully");
      closeEditModal();
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  // Add feature
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput]);
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Add package content
  const addPackageContent = () => {
    if (!packageContentInput.trim()) return;
    setPackageContent([...packageContent, packageContentInput]);
    setPackageContentInput("");
  };

  const removePackageContent = (index) => {
    setPackageContent(packageContent.filter((_, i) => i !== index));
  };

  // Add FAQ
  const addFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      toast.error("Please fill both question and answer");
      return;
    }
    setFaqs([...faqs, { question: faqQuestion, answer: faqAnswer }]);
    setFaqQuestion("");
    setFaqAnswer("");
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Select icon
  const selectIcon = (iconName) => {
    setSelectedIcon(iconName);
    setShowIconModal(false);
  };

  // Filter icons
  const filteredIcons = MARKETING_ICONS.filter(
    ({ name, category }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const SelectedIconComponent = selectedIcon
    ? MARKETING_ICONS.find((i) => i.name === selectedIcon)?.icon
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="w-16 h-16 border-4 border-t-primary border-b-gray-300 border-l-gray-300 border-r-gray-300 
      rounded-full animate-spin"
        ></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl text-center font-bold mb-8 text-whitePure">
          Manage Services
        </h2>

        {services.length === 0 ? (
          <div className="bg-cardBg p-12 rounded-2xl text-center">
            <AlertCircle size={64} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold text-whitePure mb-2">
              No Services Found
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't added any services yet. Start by adding your first
              service!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = MARKETING_ICONS.find(
                (i) => i.name === service.icon,
              )?.icon;

              return (
                <div
                  key={service.id}
                  className="bg-cardBg p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-dark rounded-xl mb-4">
                    {IconComponent && (
                      <IconComponent size={32} className="text-primary-light" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-whitePure mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Features count */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <CheckCircle size={16} className="text-primary-light" />
                    <span>{service.features?.length || 0} features</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex-1 bg-primary-dark py-2 px-4 rounded-lg text-whitePure hover:bg-primary transition flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="flex-1 bg-red-600 py-2 px-4 rounded-lg text-whitePure hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-cardBg rounded-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-cardBg p-6 border-b border-grayLight flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-whitePure">
                  Edit Service
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-whitePure hover:text-primary transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* BASIC INFORMATION */}
                <div className="mb-8 p-5 bg-grayLight rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-light mb-4">
                    Basic Information
                  </h3>

                  {/* Icon Picker */}
                  <div className="mb-6">
                    <label className="block mb-3 text-sm font-medium text-whitePure">
                      Choose Icon *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowIconModal(true)}
                      className="w-full p-4 rounded-xl bg-grayDarkest text-whitePure hover:bg-primary-dark transition flex items-center justify-center gap-3"
                    >
                      {SelectedIconComponent ? (
                        <>
                          <SelectedIconComponent
                            size={24}
                            className="text-primary-light"
                          />
                          <span>Change Icon</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={24} className="text-primary-light" />
                          <span>Select Icon</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Social Media Management"
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Short Description *
                    </label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the service..."
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Service Features *
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addFeature()}
                        placeholder="Add a feature (press Enter)"
                        className="flex-1 px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="bg-primary-dark px-4 py-2 rounded-lg text-whitePure hover:bg-primary 
                         transition flex items-center justify-center w-full sm:w-auto mt-2 sm:mt-0"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {features.length > 0 && (
                      <ul className="space-y-2">
                        {features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-grayDarkest px-4 py-3 rounded-lg group hover:bg-gray-700 transition"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={16}
                                className="text-primary-light"
                              />
                              <span className="text-whitePure">{feature}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* HERO SECTION */}
                <div className="mb-8 p-5 bg-grayLight rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-light mb-4">
                    Hero Section
                  </h3>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="e.g., Transform Your Social Media Presence"
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Hero Subtitle
                    </label>
                    <textarea
                      rows="2"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder="e.g., Professional social media management that drives engagement and growth"
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Hero Image URL
                    </label>
                    <input
                      type="text"
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      placeholder="https://example.com/hero-image.jpg"
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* SERVICE EXPLANATION */}
                <div className="mb-8 p-5 bg-grayLight rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-light mb-4">
                    Service Explanation
                  </h3>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Detailed Explanation
                    </label>
                    <textarea
                      rows="6"
                      value={serviceExplanation}
                      onChange={(e) => setServiceExplanation(e.target.value)}
                      placeholder="Provide a detailed explanation of what this service includes, how it works, and what makes it unique..."
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* PACKAGE CONTENT */}
                <div className="mb-8 p-5 bg-grayLight rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-light mb-4">
                    Package Content - What's Included?
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={packageContentInput}
                      onChange={(e) => setPackageContentInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addPackageContent()
                      }
                      placeholder="Add package item (press Enter)"
                      className="flex-1 px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    />
                    <button
                      type="button"
                      onClick={addPackageContent}
                      className="bg-primary-dark px-4 py-2 rounded-lg text-whitePure hover:bg-primary 
                       transition flex items-center justify-center w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {packageContent.length > 0 && (
                    <ul className="space-y-2">
                      {packageContent.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-grayDarkest px-4 py-3 rounded-lg group hover:bg-gray-700 transition"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              size={16}
                              className="text-primary-light"
                            />
                            <span className="text-whitePure">{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePackageContent(index)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* BEFORE / AFTER */}
                <div className="mb-8 p-5 bg-grayLight rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-light mb-4 flex items-center gap-2">
                    <Image size={20} />
                    Before / After (Optional)
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Before */}
                    <div>
                      <h4 className="text-md font-semibold text-whitePure mb-3">
                        Before
                      </h4>
                      <div className="mb-3">
                        <label className="block mb-2 text-sm font-medium text-whitePure">
                          Before Text
                        </label>
                        <textarea
                          rows="3"
                          value={beforeText}
                          onChange={(e) => setBeforeText(e.target.value)}
                          placeholder="Describe the situation before using this service..."
                          className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-whitePure">
                          Before Image URL
                        </label>
                        <input
                          type="text"
                          value={beforeImageUrl}
                          onChange={(e) => setBeforeImageUrl(e.target.value)}
                          placeholder="https://example.com/before.jpg"
                          className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* After */}
                    <div>
                      <h4 className="text-md font-semibold text-whitePure mb-3">
                        After
                      </h4>
                      <div className="mb-3">
                        <label className="block mb-2 text-sm font-medium text-whitePure">
                          After Text
                        </label>
                        <textarea
                          rows="3"
                          value={afterText}
                          onChange={(e) => setAfterText(e.target.value)}
                          placeholder="Describe the results after using this service..."
                          className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-whitePure">
                          After Image URL
                        </label>
                        <input
                          type="text"
                          value={afterImageUrl}
                          onChange={(e) => setAfterImageUrl(e.target.value)}
                          placeholder="https://example.com/after.jpg"
                          className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="mb-8 p-5 bg-grayLight rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-light mb-4 flex items-center gap-2">
                    <HelpCircle size={20} />
                    Frequently Asked Questions
                  </h3>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="e.g., How long does it take to see results?"
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-whitePure">
                      Answer
                    </label>
                    <textarea
                      rows="3"
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="Provide a detailed answer..."
                      className="w-full px-4 py-2 rounded-lg bg-grayDarkest text-whitePure placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addFaq}
                    className="w-full bg-primary-dark px-4 py-2 rounded-lg text-whitePure hover:bg-primary 
                     transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add FAQ
                  </button>

                  {faqs.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="bg-grayDarkest p-4 rounded-lg group hover:bg-gray-700 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-primary-light">
                              Q: {faq.question}
                            </h5>
                            <button
                              type="button"
                              onClick={() => removeFaq(index)}
                              className="text-red-400 hover:text-red-500 ml-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-whitePure text-sm">
                            A: {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex gap-3">
                  <button
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-600 py-3 rounded-xl text-whitePure font-semibold hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex-1 bg-primary-dark py-3 rounded-xl text-whitePure font-semibold
                     hover:bg-primary transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Icon Modal */}
        {showIconModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-cardBg rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border border-grayLight">
              <div className="flex items-center justify-between p-6 border-b border-grayLight">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-whitePure mb-3">
                    Select Marketing Icon
                  </h2>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search icons..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowIconModal(false);
                    setSearchQuery("");
                  }}
                  className="ml-4 text-whitePure hover:text-primary transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                  {filteredIcons.map(({ name, icon: Icon, category }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => selectIcon(name)}
                      className={`p-4 rounded-xl flex items-center justify-center transition relative group
          ${
            selectedIcon === name
              ? "bg-primary text-whitePure ring-2 ring-primary-light"
              : "bg-grayLight text-whitePure hover:bg-primary-dark"
          }`}
                      title={`${name} - ${category}`}
                    >
                      <Icon
                        size={22}
                        className="sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-blackPure text-whitePure text-xs px-2 py-1 rounded whitespace-nowrap">
                        {name}
                      </div>
                    </button>
                  ))}
                </div>

                {filteredIcons.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Search size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No icons found</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-grayLight bg-grayDarkest">
                <p className="text-sm text-gray-400 text-center">
                  {filteredIcons.length} marketing icons available
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deleteTarget && (
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
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base">
                    Are you sure you want to delete the service{" "}
                    <span className="font-bold text-whitePure">
                      "{deleteTarget.title}"
                    </span>
                    ?
                  </p>

                  <div className="bg-grayLight rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Features:
                      </span>
                      <span className="text-whitePure text-sm sm:text-base">
                        {deleteTarget.features?.length || 0}
                      </span>
                    </div>
                    {deleteTarget.packageContent?.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs sm:text-sm">
                          Package Items:
                        </span>
                        <span className="text-whitePure text-sm sm:text-base">
                          {deleteTarget.packageContent.length}
                        </span>
                      </div>
                    )}
                    {deleteTarget.faqs?.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs sm:text-sm">
                          FAQs:
                        </span>
                        <span className="text-whitePure text-sm sm:text-base">
                          {deleteTarget.faqs.length}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-red-400 font-semibold mb-2 text-sm sm:text-base">
                      ⚠️ Warning
                    </p>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      This action cannot be undone. All service data will be
                      permanently deleted.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-grayLight text-whitePure hover:bg-grayDark transition font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
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
