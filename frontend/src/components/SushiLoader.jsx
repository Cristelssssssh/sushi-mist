import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";

/**
 * SushiLoader — A sushi roll receiving bites, fades out when done.
 * Pure SVG + framer-motion. Used as a full-screen splash + inline button loader.
 */
const SushiLoader = ({ inline = false, label }) => {
  const { t } = useI18n();
  const text = label ?? t("sending");

  // Bite mask: animate 3 chomps cycling
  const bite = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: [0, 1.1, 1, 1, 0], opacity: [0, 1, 1, 1, 0] },
  };

  const SushiSVG = (
    <svg
      viewBox="0 0 120 120"
      width={inline ? 36 : 120}
      height={inline ? 36 : 120}
      className="drop-shadow-[0_4px_20px_rgba(230,92,0,0.35)]"
    >
      <defs>
        <radialGradient id="rice" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff8ee" />
          <stop offset="100%" stopColor="#e8dac0" />
        </radialGradient>
        <linearGradient id="salmon" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff9966" />
          <stop offset="50%" stopColor="#ff7849" />
          <stop offset="100%" stopColor="#e85a2c" />
        </linearGradient>
        <linearGradient id="nori" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1a3024" />
          <stop offset="100%" stopColor="#0a1612" />
        </linearGradient>
        <mask id="biteMask">
          <rect width="120" height="120" fill="white" />
          <motion.circle
            cx="92"
            cy="34"
            r="14"
            fill="black"
            variants={bite}
            initial="initial"
            animate="animate"
            transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.15, 0.3, 0.85, 1], delay: 0 }}
          />
          <motion.circle
            cx="28"
            cy="38"
            r="13"
            fill="black"
            variants={bite}
            initial="initial"
            animate="animate"
            transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.15, 0.3, 0.85, 1], delay: 0.8 }}
          />
          <motion.circle
            cx="60"
            cy="92"
            r="13"
            fill="black"
            variants={bite}
            initial="initial"
            animate="animate"
            transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.15, 0.3, 0.85, 1], delay: 1.6 }}
          />
        </mask>
      </defs>
      <g mask="url(#biteMask)">
        {/* nori ring */}
        <circle cx="60" cy="60" r="46" fill="url(#nori)" />
        {/* rice */}
        <circle cx="60" cy="60" r="38" fill="url(#rice)" />
        {/* rice grains */}
        <g fill="#fffaf1" opacity="0.9">
          <ellipse cx="48" cy="50" rx="3" ry="1.6" />
          <ellipse cx="70" cy="46" rx="3" ry="1.6" transform="rotate(20 70 46)" />
          <ellipse cx="55" cy="68" rx="3" ry="1.6" transform="rotate(-15 55 68)" />
          <ellipse cx="72" cy="72" rx="3" ry="1.6" transform="rotate(40 72 72)" />
          <ellipse cx="42" cy="68" rx="3" ry="1.6" transform="rotate(-30 42 68)" />
        </g>
        {/* salmon top */}
        <ellipse cx="60" cy="58" rx="22" ry="14" fill="url(#salmon)" />
        <path
          d="M40 58 Q50 52 60 58 T80 58"
          stroke="#ffd1b0"
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M42 62 Q52 56 60 62 T78 62"
          stroke="#ffd1b0"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      </g>
      {/* sesame seeds */}
      <circle cx="92" cy="62" r="1.3" fill="#f6e7c8" />
      <circle cx="30" cy="72" r="1.3" fill="#f6e7c8" />
      <circle cx="58" cy="34" r="1.3" fill="#f6e7c8" />
    </svg>
  );

  if (inline) {
    return (
      <span className="inline-flex items-center gap-3" data-testid="sushi-loader-inline">
        {SushiSVG}
        <span className="text-sm tracking-wide">{text}</span>
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0C10]/85 backdrop-blur-md"
      data-testid="sushi-loader-overlay"
    >
      <motion.div
        animate={{ rotate: [0, 4, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {SushiSVG}
      </motion.div>
      <p
        className="mt-6 font-serif text-2xl text-[#F2F3F5]/90"
        style={{ fontFamily: '"Cormorant Garamond", serif' }}
      >
        {text}
      </p>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#E65C00]"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SushiLoader;
