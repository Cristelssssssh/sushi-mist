import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import { useCart } from "../context/CartContext";

const OrderConfirmation = ({ url, onClose }) => {
  const { t } = useI18n();
  const { triggerChef } = useCart();

  // Auto-redirect to WhatsApp on mount (small delay to show the bow)
  useEffect(() => {
    triggerChef("bow");
    const t1 = window.setTimeout(() => {
      window.open(url, "_blank", "noopener");
    }, 1400);
    return () => window.clearTimeout(t1);
  }, [url, triggerChef]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A0C10]/85 px-6 backdrop-blur-md"
      data-testid="order-confirmation"
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#12151C] p-8 text-center"
      >
        {/* Big chef bowing */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 18, 0, 18, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto mb-4 flex justify-center"
          style={{ transformOrigin: "50% 90%" }}
        >
          <svg viewBox="0 0 100 130" width="120" height="156">
            <ellipse cx="50" cy="14" rx="22" ry="10" fill="#fff" />
            <rect x="32" y="20" width="36" height="10" rx="2" fill="#f1f1f1" />
            <rect x="28" y="30" width="44" height="6" fill="#b8232f" />
            <ellipse cx="50" cy="56" rx="20" ry="22" fill="#f5d6b5" />
            <circle cx="42" cy="52" r="2.2" fill="#1a1a1a" />
            <circle cx="58" cy="52" r="2.2" fill="#1a1a1a" />
            <path d="M42 62 Q50 70 58 62" stroke="#3a1f1f" strokeWidth="1.8" fill="#5a1a1a" />
            <circle cx="38" cy="60" r="2.5" fill="#ff8a7a" opacity="0.55" />
            <circle cx="62" cy="60" r="2.5" fill="#ff8a7a" opacity="0.55" />
            <path d="M22 90 Q50 80 78 90 L78 130 L22 130 Z" fill="#fafafa" />
          </svg>
        </motion.div>

        <h3
          className="text-3xl text-[#F2F3F5]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          {t("confirmed_title")}
        </h3>
        <p className="mt-2 text-sm italic text-[#FF7A22]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          {t("confirmed_sub")}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#A1AAB8]">
          {t("confirmed_msg")}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="open-whatsapp-link"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#0A0C10] hover:bg-[#20BD5A]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6L0 24l6.18-1.62A11.85 11.85 0 0 0 12 24c6.63 0 12-5.37 12-12a11.86 11.86 0 0 0-3.48-8.52ZM12 22a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.67.96.98-3.58-.23-.37A9.92 9.92 0 1 1 22 12 9.93 9.93 0 0 1 12 22Z" />
            </svg>
            {t("open_whatsapp")}
          </a>
          <button
            onClick={onClose}
            data-testid="close-confirmation-button"
            className="text-xs uppercase tracking-[0.25em] text-[#A1AAB8] hover:text-white"
          >
            {t("close")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation;
