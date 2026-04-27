import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useI18n } from "../i18n";
import { useCart } from "../context/CartContext";

const MenuCard = ({ item }) => {
  const { lang, t } = useI18n();
  const { addItem } = useCart();
  const imgRef = useRef(null);
  const [pop, setPop] = useState(false);

  const handleAdd = () => {
    const rect = imgRef.current?.getBoundingClientRect();
    addItem(
      {
        id: item.id,
        name: lang === "es" ? item.name_es : item.name_en,
        price: item.price,
        image: item.image,
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
        <img
          src={item.image}
          alt={lang === "es" ? item.name_es : item.name_en}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
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
            {lang === "es" ? item.name_es : item.name_en}
          </h3>
          <span className="whitespace-nowrap text-base font-medium text-[#E65C00]">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[#A1AAB8]">
          {lang === "es" ? item.desc_es : item.desc_en}
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
