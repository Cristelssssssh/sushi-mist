import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";

/**
 * FlyingItem — animates added sushi from menu card position
 * to the cart bubble (bottom-right area) when addItem is called.
 */
const FlyingItem = () => {
  const { flyingItem } = useCart();

  return (
    <AnimatePresence>
      {flyingItem && (
        <motion.img
          key={flyingItem.key}
          src={flyingItem.image}
          alt=""
          initial={{
            position: "fixed",
            top: flyingItem.y,
            left: flyingItem.x,
            width: flyingItem.w,
            height: flyingItem.h,
            borderRadius: 16,
            opacity: 1,
            scale: 1,
            rotate: 0,
            zIndex: 60,
          }}
          animate={{
            top: window.innerHeight - 90,
            left: window.innerWidth - 100,
            width: 50,
            height: 50,
            borderRadius: 999,
            opacity: 0.4,
            scale: 0.4,
            rotate: 360,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.65, 0.0, 0.35, 1.0] }}
          style={{ pointerEvents: "none", objectFit: "cover" }}
        />
      )}
    </AnimatePresence>
  );
};

export default FlyingItem;
