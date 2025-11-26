import { X, Loader2 } from "lucide-react";
import { type ReactNode } from "react";

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
  return (
    <div
      className="
        fixed inset-0 
        bg-black/40 
        backdrop-blur-sm 
        flex items-center justify-center 
        z-50 
        animate-fadeIn
      "
    >
      <div
        className="
          w-[95%] max-w-xl 
          rounded-[32px]
          shadow-2xl 
          border border-white/40 
          bg-gradient-to-br from-white/80 to-white/60 
          backdrop-blur-2xl 
          p-8 
          animate-slideUp
          max-h-[90vh] 
          overflow-y-auto
        "
      >
       
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="
                p-3 
                rounded-2xl 
                bg-[#F3F0FF] 
                border border-[#E0DCFF] 
                shadow-sm
              "
            >
              {icon}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#2F2F36]">
                {title}
              </h2>
              <p className="text-sm text-gray-500">
                Preencha os dados desta categoria.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="
              p-2 rounded-xl 
              text-gray-600 
              hover:text-black 
              hover:bg-black/10 
              transition
            "
          >
            <X size={22} />
          </button>
        </div>

  
        <div className="space-y-7">
          {children}
        </div>

        <button
          onClick={onAction}
          disabled={loading}
          className="
            w-full mt-8 
            bg-gradient-to-r from-[#7B61FF] to-[#6A54E6]
            text-white rounded-xl px-6 py-3 
            font-medium shadow-sm 
            hover:shadow-lg hover:shadow-[#7B61FF]/20
            transition active:scale-[0.97]
            disabled:opacity-60 
            flex items-center justify-center gap-2
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
      </div>
    </div>
  );
}
