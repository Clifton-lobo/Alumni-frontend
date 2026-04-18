import { useNavigate } from "react-router-dom";
import { X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const LoginPromptModal = ({ open, onClose, message = "Sign in to continue" }) => {
  const navigate = useNavigate();

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#F2A20A]/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-[#F2A20A]" />
            </div>
            <h2 className="text-xl font-bold text-[#142A5D] mb-2">Sign in required</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full py-3 rounded-xl font-semibold text-white mb-3"
              style={{ backgroundColor: "#F2A20A" }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className="w-full py-3 rounded-xl font-semibold text-[#142A5D] border border-gray-200"
            >
              Create Account
            </button>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LoginPromptModal;