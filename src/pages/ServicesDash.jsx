import { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  CheckCircle,
  Sparkles,
  Search,
  RefreshCw,
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

import { MARKETING_ICONS } from "../utils/marketing";
import toast from "react-hot-toast";

export default function AddServices() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [showIconModal, setShowIconModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput]);
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const selectIcon = (iconName) => {
    setSelectedIcon(iconName);
    setShowIconModal(false);
  };

  const filteredIcons = MARKETING_ICONS.filter(
    ({ name, category }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SelectedIconComponent = selectedIcon
    ? MARKETING_ICONS.find((i) => i.name === selectedIcon)?.icon
    : null;

  const handleSaveService = async () => {
    if (!selectedIcon || !title || !description || features.length === 0) {
      toast.error("Please fill all fields and add at least one feature");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "services"), {
        icon: selectedIcon,
        title: title,
        description: description,
        features: features,
        createdAt: new Date().toISOString(),
      });

      toast.success("Service added successfully");

      setSelectedIcon(null);
      setTitle("");
      setDescription("");
      setFeatures([]);
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Error adding service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto bg-cardBg p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl sm:text-2xl text-center font-bold mb-6 text-whitePure">
          Add Marketing Service
        </h2>

        {/* Icon Picker */}
        <div className="mb-6">
          <label className="block mb-3 text-sm font-medium text-whitePure">
            Choose Icon
          </label>

          <button
            type="button"
            onClick={() => setShowIconModal(true)}
            className="w-full p-4 rounded-xl bg-grayLight text-whitePure hover:bg-primary-dark transition flex items-center justify-center gap-3"
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
            Service Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Social Media Management"
            className="w-full px-4 py-2 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-whitePure">
            Description
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your marketing service..."
            className="w-full px-4 py-2 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Features */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-whitePure">
            Service Features
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFeature()}
              placeholder="Add a feature (press Enter)"
              className="flex-1 px-4 py-2 rounded-lg bg-grayLight text-whitePure placeholder-gray-400 
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
                  className="flex items-center justify-between bg-grayLight px-4 py-3 rounded-lg group hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary-light" />
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

        {/* Save */}
        <button
          onClick={handleSaveService}
          disabled={loading}
          className="w-full bg-primary-dark py-3 rounded-xl text-whitePure font-semibold hover:bg-primary transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              <span>Save Service</span>
            </>
          )}
        </button>

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
      </div>
    </div>
  );
}
