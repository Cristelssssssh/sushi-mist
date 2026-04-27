import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useI18n } from "../i18n";
import SushiLoader from "./SushiLoader";
import OrderConfirmation from "./OrderConfirmation";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "5352473962"; // Cuba +53 (no plus, wa.me format)
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const buildWhatsAppMessage = ({ items, total, customer_name, customer_phone, address, notes, lang }) => {
  const lines = [];
  if (lang === "es") {
    lines.push("*Nuevo pedido — Kyoto Ame*");
    lines.push("");
    lines.push(`*Cliente:* ${customer_name}`);
    lines.push(`*Teléfono:* ${customer_phone}`);
    lines.push(`*Dirección:* ${address}`);
    if (notes) lines.push(`*Notas:* ${notes}`);
    lines.push("");
    lines.push("*Pedido:*");
    items.forEach((i) => {
      lines.push(`• ${i.qty} × ${i.name} — $${(i.qty * i.price).toFixed(2)}`);
    });
    lines.push("");
    lines.push(`*Total: $${total.toFixed(2)}*`);
  } else {
    lines.push("*New Order — Kyoto Ame*");
    lines.push("");
    lines.push(`*Customer:* ${customer_name}`);
    lines.push(`*Phone:* ${customer_phone}`);
    lines.push(`*Address:* ${address}`);
    if (notes) lines.push(`*Notes:* ${notes}`);
    lines.push("");
    lines.push("*Order:*");
    items.forEach((i) => {
      lines.push(`• ${i.qty} × ${i.name} — $${(i.qty * i.price).toFixed(2)}`);
    });
    lines.push("");
    lines.push(`*Total: $${total.toFixed(2)}*`);
  }
  return lines.join("\n");
};

const FloatingCart = () => {
  const { items, count, total, open, setOpen, inc, dec, remove, clear, triggerChef } = useCart();
  const { t, lang } = useI18n();

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null); // {url}

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      toast.error(t("require_items"));
      return;
    }
    if (!form.name.trim()) return toast.error(t("name_required"));
    if (!form.phone.trim()) return toast.error(t("phone_required"));
    if (!form.address.trim()) return toast.error(t("address_required"));

    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total: Number(total.toFixed(2)),
      };
      // store + then build WA link
      await axios.post(`${API}/orders`, payload);

      const message = buildWhatsAppMessage({
        items,
        total,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        address: payload.address,
        notes: payload.notes,
        lang,
      });
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // brief loader effect for "Preparando tu experiencia..."
      await new Promise((r) => setTimeout(r, 900));
      triggerChef("bow");
      setConfirmation({ url });
      // clear cart locally after building order
      clear();
      setOpen(false);
      setForm({ name: "", phone: "", address: "", notes: "" });
    } catch (err) {
      console.error(err);
      toast.error(lang === "es" ? "No se pudo enviar el pedido." : "Could not send the order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            data-testid="cart-overlay"
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0A0C10] shadow-2xl"
              data-testid="cart-drawer"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <h3
                  className="text-2xl text-[#F2F3F5]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {t("your_order")}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-[#A1AAB8] hover:bg-white/10 hover:text-white"
                  data-testid="close-cart-button"
                  aria-label="close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center" data-testid="cart-empty">
                    <div className="mb-3 text-5xl opacity-60">🍣</div>
                    <p
                      className="text-xl text-[#F2F3F5]"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t("empty_cart")}
                    </p>
                    <p className="mt-2 text-sm text-[#A1AAB8]">{t("pick_something")}</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {items.map((it) => (
                      <li
                        key={it.id}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#12151C] p-3"
                        data-testid={`cart-item-${it.id}`}
                      >
                        <img src={it.image} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm text-[#F2F3F5]">{it.name}</div>
                          <div className="text-xs text-[#A1AAB8]">${it.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                          <button
                            onClick={() => dec(it.id)}
                            data-testid={`dec-${it.id}-button`}
                            className="rounded-full p-1 text-[#A1AAB8] hover:bg-white/10 hover:text-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-5 text-center text-sm text-[#F2F3F5]">{it.qty}</span>
                          <button
                            onClick={() => inc(it.id)}
                            data-testid={`inc-${it.id}-button`}
                            className="rounded-full p-1 text-[#A1AAB8] hover:bg-white/10 hover:text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(it.id)}
                          data-testid={`remove-${it.id}-button`}
                          className="rounded-full p-2 text-[#A1AAB8] hover:bg-red-500/10 hover:text-red-400"
                          aria-label="remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Form + total */}
              {items.length > 0 && (
                <form
                  onSubmit={handleSubmit}
                  className="border-t border-white/10 bg-[#0A0C10] px-6 py-5"
                  data-testid="checkout-form"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={update("name")}
                      placeholder={t("name_ph")}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#5D6778] focus:border-[#E65C00] focus:outline-none"
                      data-testid="customer-name-input"
                    />
                    <input
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder={t("phone_ph")}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#5D6778] focus:border-[#E65C00] focus:outline-none"
                      data-testid="customer-phone-input"
                    />
                    <input
                      value={form.address}
                      onChange={update("address")}
                      placeholder={t("address_ph")}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#5D6778] focus:border-[#E65C00] focus:outline-none sm:col-span-2"
                      data-testid="customer-address-input"
                    />
                    <input
                      value={form.notes}
                      onChange={update("notes")}
                      placeholder={t("notes_ph")}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#5D6778] focus:border-[#E65C00] focus:outline-none sm:col-span-2"
                      data-testid="customer-notes-input"
                    />
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] text-[#A1AAB8]">
                      {t("total")}
                    </span>
                    <span
                      className="text-3xl text-[#F2F3F5]"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      data-testid="cart-total"
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: count > 0
                        ? [
                            "0 0 0 rgba(37,211,102,0.0)",
                            "0 0 30px rgba(37,211,102,0.55)",
                            "0 0 0 rgba(37,211,102,0.0)",
                          ]
                        : "0 0 0 rgba(37,211,102,0)",
                    }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-[#0A0C10] transition-colors hover:bg-[#20BD5A] disabled:opacity-60"
                    data-testid="send-whatsapp-button"
                  >
                    {submitting ? (
                      <SushiLoader inline />
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                          <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6L0 24l6.18-1.62A11.85 11.85 0 0 0 12 24c6.63 0 12-5.37 12-12a11.86 11.86 0 0 0-3.48-8.52ZM12 22a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.67.96.98-3.58-.23-.37A9.92 9.92 0 1 1 22 12 9.93 9.93 0 0 1 12 22Zm5.45-7.42c-.3-.15-1.77-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.18 8.18 0 0 1-2.41-1.49 9.06 9.06 0 0 1-1.67-2.07c-.17-.3 0-.46.13-.6s.3-.35.45-.52a2 2 0 0 0 .3-.5.55.55 0 0 0 0-.52c-.07-.15-.67-1.62-.92-2.22s-.49-.5-.67-.5h-.57a1.1 1.1 0 0 0-.8.37 3.36 3.36 0 0 0-1.05 2.5 5.83 5.83 0 0 0 1.22 3.1 13.34 13.34 0 0 0 5.1 4.5c.71.3 1.27.49 1.7.62a4.12 4.12 0 0 0 1.88.12 3.07 3.07 0 0 0 2-1.42 2.5 2.5 0 0 0 .17-1.42c-.07-.13-.27-.2-.57-.35Z" />
                        </svg>
                        {t("send_whatsapp")}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating cart bubble (mobile-friendly) */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 30 }}
            onClick={() => setOpen(true)}
            data-testid="floating-cart-button"
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#12151C]/90 px-5 py-3 text-sm text-[#F2F3F5] shadow-2xl backdrop-blur-md sm:bottom-8 sm:right-8"
            style={{ boxShadow: "0 0 30px rgba(230,92,0,0.25)" }}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E65C00] text-xs font-bold text-white">
              {count}
            </span>
            <span>{t("cart")} · ${total.toFixed(2)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>{submitting && <SushiLoader />}</AnimatePresence>

      <AnimatePresence>
        {confirmation && (
          <OrderConfirmation
            url={confirmation.url}
            onClose={() => setConfirmation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCart;
