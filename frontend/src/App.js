import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { I18nProvider } from "@/i18n";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";

function App() {
  return (
    <div className="App">
      <I18nProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
              style: {
                background: "#12151C",
                color: "#F2F3F5",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          />
        </CartProvider>
      </I18nProvider>
    </div>
  );
}

export default App;
