import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import { useCart } from "../context/CartContext";

const Hero = () => {
  const { t } = useI18n();
  const { setOpen, count } = useCart();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.pexels.com/photos/32035911/pexels-photo-32035911.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600"
          alt=""
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C10]/60 via-[#0A0C10]/40 to-[#0A0C10]" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 sm:py-32 lg:grid-cols-2">
        <div className="relative">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.4em] text-[#FF7A22]"
          >
            京都 · 雨 — Kyoto · Ame
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-4xl leading-[1.05] text-[#F2F3F5] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: "-0.02em" }}
          >
            {t("hero_title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-[#A1AAB8]"
          >
            {t("hero_subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#menu"
              data-testid="hero-menu-cta"
              className="inline-flex items-center gap-2 rounded-full bg-[#E65C00] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF7A22]"
            >
              {t("hero_cta")}
              <span aria-hidden>→</span>
            </a>
            <button
              onClick={() => setOpen(true)}
              data-testid="hero-whatsapp-cta"
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all ${
                count > 0
                  ? "border-transparent bg-[#25D366] text-[#0A0C10] hover:bg-[#20BD5A]"
                  : "border-white/15 bg-white/5 text-[#F2F3F5] hover:bg-white/10"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6L0 24l6.18-1.62A11.85 11.85 0 0 0 12 24c6.63 0 12-5.37 12-12a11.86 11.86 0 0 0-3.48-8.52Z" />
              </svg>
              {t("hero_secondary")}
            </button>
          </motion.div>
        </div>

        {/* Right: floating sushi composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative hidden h-[420px] lg:block"
        >
          <motion.img
            src="https://images.pexels.com/photos/31286785/pexels-photo-31286785.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt=""
            className="absolute right-0 top-6 w-[280px] rounded-3xl border border-white/10 object-cover shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.img
            src="https://images.pexels.com/photos/31415308/pexels-photo-31415308.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt=""
            className="absolute bottom-0 left-4 w-[240px] rounded-3xl border border-white/10 object-cover shadow-2xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
          />
          {/* Lantern */}
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute right-12 top-[180px] h-16 w-12 rounded-md bg-[#b8232f] shadow-[0_0_60px_rgba(255,120,40,0.45)]"
            style={{ transformOrigin: "50% 0%" }}
          >
            <div className="absolute inset-x-1 top-1/2 h-px bg-[#5a1620]" />
            <div className="absolute -top-1 left-1/2 h-2 w-px -translate-x-1/2 bg-[#5a1620]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
