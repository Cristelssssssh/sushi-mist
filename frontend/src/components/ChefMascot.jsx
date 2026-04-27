import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useI18n } from "../i18n";

/**
 * ChefMascot — A traditional Japanese sushi chef SVG mascot.
 * Reacts to cart events: idle, smile, approve (thumbs up), bow.
 * Speech bubble appears with localized text.
 */
const ChefMascot = () => {
  const { chefMood } = useCart();
  const { t } = useI18n();

  const speeches = {
    idle: t("chef_idle"),
    smile: t("chef_smile"),
    approve: t("chef_approve"),
    bow: t("chef_bow"),
  };

  const showBubble = chefMood !== "idle";

  // Bow animation: rotate forward
  const containerVariants = {
    idle: { rotate: 0, y: 0 },
    smile: { rotate: 0, y: -2 },
    approve: { rotate: 0, y: -3 },
    bow: { rotate: 18, y: 4 },
  };

  // Mouth path
  const mouthByMood = {
    idle: "M44 64 Q50 66 56 64",
    smile: "M42 62 Q50 70 58 62",
    approve: "M42 62 Q50 72 58 62",
    bow: "M44 64 Q50 65 56 64",
  };

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-6 z-40 flex items-end gap-3 sm:bottom-8 sm:left-8"
      data-testid="chef-mascot"
    >
      <motion.div
        variants={containerVariants}
        animate={chefMood}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="relative"
        style={{ transformOrigin: "50% 90%" }}
      >
        <svg viewBox="0 0 100 130" width="92" height="120">
          <defs>
            <linearGradient id="hat" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#dcdcdc" />
            </linearGradient>
            <linearGradient id="jacket" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fafafa" />
              <stop offset="100%" stopColor="#e6e6e6" />
            </linearGradient>
            <linearGradient id="band" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#b8232f" />
              <stop offset="100%" stopColor="#7a1620" />
            </linearGradient>
          </defs>
          {/* Hat (chef toque) */}
          <ellipse cx="50" cy="14" rx="22" ry="10" fill="url(#hat)" />
          <rect x="32" y="20" width="36" height="10" rx="2" fill="#f1f1f1" />
          {/* Headband */}
          <rect x="28" y="30" width="44" height="6" fill="url(#band)" />
          <circle cx="40" cy="33" r="1.6" fill="#fff" />
          {/* Face */}
          <ellipse cx="50" cy="56" rx="20" ry="22" fill="#f5d6b5" />
          {/* Hair sides */}
          <path d="M30 50 Q28 38 36 34 L38 42 Q33 44 30 50Z" fill="#1a1a1a" />
          <path d="M70 50 Q72 38 64 34 L62 42 Q67 44 70 50Z" fill="#1a1a1a" />
          {/* Eyes */}
          <motion.g
            animate={{ scaleY: chefMood === "approve" ? 0.2 : 1 }}
            style={{ transformOrigin: "50px 52px" }}
            transition={{ duration: 0.25 }}
          >
            <circle cx="42" cy="52" r="2.2" fill="#1a1a1a" />
            <circle cx="58" cy="52" r="2.2" fill="#1a1a1a" />
          </motion.g>
          {/* Brows (raise on approve) */}
          <motion.g animate={{ y: chefMood === "approve" ? -2 : 0 }}>
            <path d="M37 47 Q42 45 47 47" stroke="#1a1a1a" strokeWidth="1.4" fill="none" />
            <path d="M53 47 Q58 45 63 47" stroke="#1a1a1a" strokeWidth="1.4" fill="none" />
          </motion.g>
          {/* Cheeks blush */}
          <circle cx="38" cy="60" r="2.5" fill="#ff8a7a" opacity="0.55" />
          <circle cx="62" cy="60" r="2.5" fill="#ff8a7a" opacity="0.55" />
          {/* Mouth — animates between moods */}
          <motion.path
            d={mouthByMood[chefMood]}
            stroke="#3a1f1f"
            strokeWidth="1.8"
            fill={chefMood === "approve" || chefMood === "smile" ? "#5a1a1a" : "none"}
            strokeLinecap="round"
            initial={false}
            animate={{ d: mouthByMood[chefMood] }}
            transition={{ duration: 0.3 }}
          />
          {/* Jacket */}
          <path d="M22 90 Q50 80 78 90 L78 130 L22 130 Z" fill="url(#jacket)" />
          {/* Jacket overlap diagonal */}
          <path d="M50 82 L40 130 L50 130 Z" fill="#e2e2e2" />
          <path d="M50 82 L60 130 L50 130 Z" fill="#f4f4f4" />
          <circle cx="46" cy="100" r="1.6" fill="#999" />
          <circle cx="54" cy="110" r="1.6" fill="#999" />
          {/* Arm with thumbs up on approve */}
          <motion.g
            initial={false}
            animate={{
              rotate: chefMood === "approve" ? -25 : 0,
              y: chefMood === "approve" ? -10 : 0,
            }}
            style={{ transformOrigin: "76px 92px" }}
            transition={{ type: "spring", stiffness: 220, damping: 12 }}
          >
            <rect x="72" y="86" width="10" height="22" rx="4" fill="url(#jacket)" />
            {chefMood === "approve" && (
              <>
                <circle cx="77" cy="84" r="5" fill="#f5d6b5" />
                <rect x="75" y="74" width="4" height="8" rx="2" fill="#f5d6b5" />
              </>
            )}
          </motion.g>
        </svg>
      </motion.div>

      <AnimatePresence>
        {showBubble && (
          <motion.div
            key={chefMood}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none mb-12 max-w-[180px] rounded-2xl rounded-bl-sm border border-white/15 bg-[#12151C]/90 px-3 py-2 text-sm text-[#F2F3F5] shadow-2xl backdrop-blur"
            data-testid="chef-bubble"
          >
            <span style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-base italic">
              {speeches[chefMood]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChefMascot;
