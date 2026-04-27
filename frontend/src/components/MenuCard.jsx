import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ImageOff } from "lucide-react";
import { useI18n } from "../i18n";
import { useCart } from "../context/CartContext";

const formatPrice = (n) => {
  // Manual thousand separator with "." (es-ES style), e.g. 2000 -> "2.000", 9.80 -> "9,80"
  if (Number.isInteger(n)) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${decPart}`;
};

const MenuCard = ({ item }) => {
  const { lang, t } = useI18n();
  const { addItem } = useCart();
  const imgRef = useRef(null);
  const [pop, setPop] = useState(false);

  const name = lang === "es" ? item.name_es : item.name_en;
  const desc = lang === "es" ? item.desc_es : item.desc_en;
  const hasImage = item.image && item.image.length > 0;

  const handleAdd = () => {
    const rect = imgRef.current?.getBoundingClientRect();
    addItem(
      {
        id: item.id,
        name,
        price: item.price,
        image: item.image || "",
      },
      rect ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height } : null
    );
    setPop(true);
    window.setTimeout(() => setPop(false), 350);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12151C]"
      data-testid={`menu-card-${item.id}`}
    >
      <div ref={imgRef} className="relative aspect-[4/3] overflow-hidden">
        {hasImage ? (
          <img
            src={item.image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // Placeholder — clean dark SVG pattern. Replace by dropping an image path in GitHub.
          <div
            className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1a1f2a] via-[#12151C] to-[#0d1017]"
            aria-label="placeholder"
          >
            <div className="relative">
              {/* decorative sushi silhouette */}
              <svg viewBox="0 0 120 120" width="88" height="88" className="opacity-25">
                <circle cx="60" cy="60" r="46" fill="#2a313e" />
                <circle cx="60" cy="60" r="34" fill="#3a414f" />
                <ellipse cx="60" cy="56" rx="22" ry="12" fill="#E65C00" opacity="0.55" />
                <circle cx="90" cy="60" r="2" fill="#5a6272" />
                <circle cx="30" cy="62" r="2" fill="#5a6272" />
              </svg>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[#A1AAB8] backdrop-blur">
                <ImageOff className="mr-1 inline h-2.5 w-2.5" />
                Imagen
              </span>
            </div>
            <p
              className="mt-6 px-4 text-center text-base text-[#F2F3F5]/80"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {name}
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#F2F3F5] backdrop-blur">
          {t(`cat_${item.category}`)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="text-xl text-[#F2F3F5]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            {name}
          </h3>
          <span className="whitespace-nowrap text-base font-medium text-[#E65C00]">
            ${formatPrice(item.price)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[#A1AAB8]">
          {desc}
        </p>
        <motion.button
          onClick={handleAdd}
          animate={pop ? { scale: [1, 0.94, 1.04, 1] } : {}}
          transition={{ duration: 0.35 }}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#E65C00]/40 bg-[#E65C00]/10 px-4 py-2.5 text-sm font-medium tracking-wide text-[#FF7A22] transition-colors hover:bg-[#E65C00] hover:text-white"
          data-testid={`add-${item.id}-button`}
        >
          <Plus className="h-4 w-4" />
          {t("add")}
        </motion.button>
      </div>
    </motion.article>
  );
};

export default MenuCard;
export { formatPrice };
