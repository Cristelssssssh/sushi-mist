import React, { useMemo, useState } from "react";
import MenuCard from "./MenuCard";
import { useI18n } from "../i18n";
import { motion } from "framer-motion";

const CATEGORIES = [
  "all",
  "bowl",
  "sushi",
  "calientes",
  "mariscos",
  "ramen",
  "entrantes",
  "postres",
  "otros",
  "bebidas",
  "salsas",
];

const MenuGrid = ({ menu }) => {
  const { t } = useI18n();
  const [active, setActive] = useState("all");

  const filtered = useMemo(
    () => (active === "all" ? menu : menu.filter((m) => m.category === active)),
    [menu, active]
  );

  return (
    <section id="menu" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28" data-testid="menu-section">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#E65C00]">
            お品書き · O-shinagaki
          </span>
          <h2
            className="mt-3 text-4xl text-[#F2F3F5] sm:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: "-0.01em" }}
          >
            {t("menu_title")}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#A1AAB8]">
            {t("menu_subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2" data-testid="category-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              data-testid={`filter-${c}`}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition-colors ${
                active === c
                  ? "border-[#E65C00] bg-[#E65C00] text-white"
                  : "border-white/10 bg-white/5 text-[#A1AAB8] hover:bg-white/10 hover:text-white"
              }`}
            >
              {t(`cat_${c}`)}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
};

export default MenuGrid;
