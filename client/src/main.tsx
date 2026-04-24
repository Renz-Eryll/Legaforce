import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

// ── Register Service Worker (PWA + Push Notifications) ──
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("✅ Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("⚠️ Service Worker registration failed:", err);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
