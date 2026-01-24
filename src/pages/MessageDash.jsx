import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Briefcase,
  User,
  MessageSquare,
  Calendar,
  Trash2,
  X,
} from "lucide-react";
import {
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export default function MessageDash() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      },
    );

    return () => unsub(); // clean up
  }, []);

  //delete message
  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, "Messages", deleteId));
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeleting(false);
    }
  };

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
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark text-center mb-9">
          Messages
        </h2>

        <div className="space-y-6">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-cardBg border border-grayLight rounded-2xl p-6 shadow-lg"
            >
              {/* Header */}
              <div className="flex  items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-primary" />
                  <span className="text-whitePure font-semibold">
                    {msg.company}
                  </span>
                </div>

                <button
                  onClick={() => setDeleteId(msg.id)}
                  className="text-red-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Info */}
              <div className="grid sm:grid-cols-2 gap-4 text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <User className="text-primary" size={18} />
                  {msg.fullName}
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="text-primary" size={18} />
                  {msg.email}
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="text-primary" size={18} />
                  {msg.phone}
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="text-primary" size={18} />
                  {msg.service}
                </div>
              </div>

              {/* Message */}
              <div className="flex items-start gap-2 bg-grayLight rounded-xl p-4">
                <MessageSquare className="text-primary mt-1" size={18} />
                <p className="text-whitePure leading-relaxed">{msg.message}</p>
              </div>
              {msg.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 sm:mt-4">
                  <Calendar size={16} />
                  {msg.createdAt.toDate().toLocaleString()}
                </div>
              )}
            </motion.div>
          ))}

          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No messages yet
            </div>
          )}
        </div>
      </div>
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cardBg rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-whitePure">
                Confirm Delete
              </h3>
              <button onClick={() => setDeleteId(null)}>
                <X className="text-gray-400 hover:text-whitePure" />
              </button>
            </div>

            <p className="text-gray-300 text-sm sm:text-base mb-6">
              Are you sure you want to delete this message?
              <br className="hidden sm:block" />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-grayLight text-whitePure hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
