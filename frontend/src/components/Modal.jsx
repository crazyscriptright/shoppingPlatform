import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-grey/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className={`relative bg-off-white rounded-xl w-full ${sizes[size]} transform transition-all z-101`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-warm-grey/30">
            <h3 className="text-2xl font-semibold text-dark-grey">{title}</h3>
            <button
              onClick={onClose}
              className="text-muted-slate hover:text-dark-grey hover:bg-warm-grey/10 p-2 rounded-lg transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
