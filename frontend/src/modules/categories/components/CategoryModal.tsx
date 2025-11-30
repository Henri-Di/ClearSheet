import { X, Loader2 } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryModalProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;

  onClose: () => void;
  onAction: () => void | Promise<void>;

  actionLabel: string;
  loading: boolean;
}

export function CategoryModal({
  title,
  icon,
  children,
  onClose,
  onAction,
  actionLabel,
  loading,
}: CategoryModalProps) {
  const root = document.getElementById("modal-root");

  // Prevent scroll behind modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!root) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="
          fixed inset-0 z-[9999]
          bg-black/40 dark:bg-black/60
          backdrop-blur-sm
          flex items-center justify-center
        "
        onClick={(e) => {
          // Fecha ao clicar fora, mas não no conteúdo
          if (e.target === e.currentTarget && !loading) onClose();
        }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 35 }}
          transition={{ duration: 0.25 }}
          className="
            w-[95%] max-w-xl max-h-[90vh]
            overflow-y-auto
            rounded-[32px] p-8
            shadow-2xl backdrop-blur-2xl
            border
            bg-gradient-to-br from-white/85 to-white/55
            dark:bg-gradient-to-br dark:from-[#1C1828]/95 dark:to-[#161320]/80
            border-white/40 dark:border-white/10
            animate-slideUp
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className="
                  p-3 rounded-2xl shadow-sm
                  bg-[#F3F0FF] border border-[#E0DCFF]
                  dark:bg-[#2A2540] dark:border-[#3A3355]
                "
              >
                {icon}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-[#2F2F36] dark:text-gray-100">
                  {title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preencha os dados desta categoria.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="
                p-2 rounded-xl transition
                text-gray-600 hover:text-black hover:bg-black/10
                dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10
                disabled:opacity-40
              "
            >
              <X size={22} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="space-y-7">
            {children}
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={onAction}
            disabled={loading}
            className="
              w-full mt-8 px-6 py-3 rounded-xl font-medium
              flex items-center justify-center gap-2
              shadow-sm hover:shadow-lg
              active:scale-[0.97] transition-all
              
              bg-gradient-to-r from-[#7B61FF] to-[#6A54E6]
              text-white
              hover:shadow-[#7B61FF]/25
              
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Aguarde...
              </>
            ) : (
              actionLabel
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    root
  );
}
