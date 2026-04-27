import React from "react";
import { useI18n } from "../i18n";
import { useCart } from "../context/CartContext";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const { lang, setLang, t } = useI18n();
  const { count, setOpen } = useCart();

  return (
    <header
      className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0C10]/70 backdrop-blur-xl"
      data-testid="site-header"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3" data-testid="brand-link">
          {/* Brand mark - sushi seal */}
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E65C00]/40 bg-[#12151C]">
            <span className="absolute inset-1 rounded-full bg-gradient-to-br from-[#ff7849] to-[#b1310f]" />
            <span className="relative font-serif text-xs text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              京
            </span>
          </span>
          <div className="leading-tight">
            <div
              className="text-lg text-[#F2F3F5]"
              style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: "0.02em" }}
            >
              {t("brand")}
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#A1AAB8]">
              {t("tagline")}
            </div>
          </div>
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Lang toggle */}
          <div
            className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-xs"
            data-testid="lang-toggle"
            role="tablist"
          >
            {["es", "en"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-testid={`lang-${l}`}
                className={`rounded-full px-3 py-1 uppercase tracking-widest transition-colors ${
                  lang === l ? "bg-[#E65C00] text-white" : "text-[#A1AAB8] hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Cart button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            data-testid="open-cart-button"
            className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#F2F3F5] transition-colors hover:bg-white/10"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{t("cart")}</span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4, y: -6 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 14 }}
                className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E65C00] px-1 text-[10px] font-semibold text-white shadow-[0_0_18px_rgba(230,92,0,0.6)]"
                data-testid="cart-count-badge"
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
