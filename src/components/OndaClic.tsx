"use client";

import { useEffect } from "react";

// Onda de agua en el punto donde se hace clic en botones, enlaces y opciones.
// Es un anillo fijo que se expande y desvanece; no interfiere con la interacción.
const SELECTOR = "button, a, [role='radio']";

export default function OndaClic() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function alPresionar(e: PointerEvent) {
      const objetivo = e.target as Element | null;
      if (!objetivo?.closest(SELECTOR)) return;
      const onda = document.createElement("span");
      onda.className = "onda-clic";
      onda.style.left = `${e.clientX}px`;
      onda.style.top = `${e.clientY}px`;
      document.body.appendChild(onda);
      setTimeout(() => onda.remove(), 800);
    }

    window.addEventListener("pointerdown", alPresionar);
    return () => window.removeEventListener("pointerdown", alPresionar);
  }, []);

  return null;
}
