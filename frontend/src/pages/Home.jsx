import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Hero from "../components/Hero";
import MenuGrid from "../components/MenuGrid";
import FloatingCart from "../components/FloatingCart";
import KyotoRain from "../components/KyotoRain";
import ChefMascot from "../components/ChefMascot";
import FlyingItem from "../components/FlyingItem";
import SushiLoader from "../components/SushiLoader";
import { useI18n } from "../i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Home = () => {
  const { t } = useI18n();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const start = Date.now();
    axios
      .get(`${API}/menu`)
      .then((r) => {
        if (mounted) setMenu(r.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        // ensure the loader is shown at least 1.6s for the bite animation
        const elapsed = Date.now() - start;
        const wait = Math.max(0, 1600 - elapsed);
        setTimeout(() => mounted && setLoading(false), wait);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0A0C10] text-[#F2F3F5]">
      <KyotoRain />
      <div className="relative z-10">
        <Header />
        <Hero />
        <MenuGrid menu={menu} />
        <footer
          className="border-t border-white/10 px-6 py-10 text-center text-xs uppercase tracking-[0.3em] text-[#5D6778]"
          data-testid="site-footer"
        >
          {t("footer")}
        </footer>
      </div>

      <ChefMascot />
      <FloatingCart />
      <FlyingItem />

      <AnimatePresence>{loading && <SushiLoader />}</AnimatePresence>
    </div>
  );
};

export default Home;
