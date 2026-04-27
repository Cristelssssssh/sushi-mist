import React, { createContext, useContext, useMemo, useReducer, useState } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "inc":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "dec":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [chefMood, setChefMood] = useState("idle"); // idle | smile | approve | bow
  const [flyingItem, setFlyingItem] = useState(null); // {x,y,image,key}
  const [open, setOpen] = useState(false);

  const triggerChef = (mood) => {
    setChefMood(mood);
    if (mood !== "idle") {
      window.clearTimeout(window.__chefTimer);
      window.__chefTimer = window.setTimeout(() => setChefMood("idle"), 2500);
    }
  };

  const addItem = (item, originRect) => {
    dispatch({ type: "add", item });
    const totalQty = state.items.reduce((s, i) => s + i.qty, 0) + 1;
    triggerChef(totalQty >= 3 ? "approve" : "smile");
    if (originRect) {
      setFlyingItem({
        key: `${item.id}-${Date.now()}`,
        image: item.image,
        x: originRect.x,
        y: originRect.y,
        w: originRect.width,
        h: originRect.height,
      });
      window.setTimeout(() => setFlyingItem(null), 900);
    }
  };

  const value = useMemo(() => {
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    const total = state.items.reduce((s, i) => s + i.qty * i.price, 0);
    return {
      items: state.items,
      count,
      total,
      open,
      setOpen,
      addItem,
      remove: (id) => dispatch({ type: "remove", id }),
      inc: (id) => dispatch({ type: "inc", id }),
      dec: (id) => dispatch({ type: "dec", id }),
      clear: () => dispatch({ type: "clear" }),
      chefMood,
      triggerChef,
      flyingItem,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, open, chefMood, flyingItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
