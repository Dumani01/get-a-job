import { createPortalApp } from "./app.js";
import { applyPreferences } from "../core/preferences.js";

// Interceptar window.speechSynthesis para corregir el bug de desactivación de lectura por voz
if (window.speechSynthesis) {
  const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
  window.speechSynthesis.speak = function (utterance) {
    try {
      const preferences = JSON.parse(localStorage.getItem("jobconnect.preferences") ?? "{}");
      if (preferences.speech) {
        originalSpeak(utterance);
      }
    } catch {
      originalSpeak(utterance);
    }
  };

  document.addEventListener("click", (event) => {
    const speechBtn = event.target.closest('button[aria-label="Lectura por voz"]');
    if (speechBtn) {
      setTimeout(() => {
        try {
          const preferences = JSON.parse(localStorage.getItem("jobconnect.preferences") ?? "{}");
          if (!preferences.speech) {
            window.speechSynthesis.cancel();
          }
        } catch {}
      }, 0);
    }
  });
}


const portalRoot = document.querySelector("#portal-app");

if (!portalRoot) {
  throw new Error("No se encontró #portal-app.");
}

applyPreferences();
createPortalApp(portalRoot);
