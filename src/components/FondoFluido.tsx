"use client";

import { useEffect, useRef } from "react";

// Fondo de fluidos: el cursor (o el dedo) deja una estela de color que se mezcla
// con un flujo lento y constante. Es solo visual y se apaga con "reducir movimiento".
type Particula = { x: number; y: number; vx: number; vy: number; vida: number; hue: number; r: number };

const MAX_PARTICULAS = 260;

export default function FondoFluido() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particulas: Particula[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;
    let ultimo: { x: number; y: number } | null = null;
    let raf = 0;

    const aleatorio = (min: number, max: number) => min + Math.random() * (max - min);

    function ajustar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function emitir(x: number, y: number, vx: number, vy: number, cantidad: number, radio: number) {
      for (let i = 0; i < cantidad && particulas.length < MAX_PARTICULAS; i++) {
        particulas.push({
          x: x + aleatorio(-6, 6),
          y: y + aleatorio(-6, 6),
          vx: vx * 0.25 + aleatorio(-0.4, 0.4),
          vy: vy * 0.25 + aleatorio(-0.4, 0.4),
          vida: 1,
          hue: aleatorio(165, 275), // de turquesa a violeta
          r: radio * aleatorio(0.8, 1.2),
        });
      }
    }

    function alMover(e: PointerEvent) {
      const prev = ultimo ?? { x: e.clientX, y: e.clientY };
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const velocidad = Math.hypot(dx, dy);
      emitir(e.clientX, e.clientY, dx, dy, 2 + Math.min(4, velocidad / 8), 16 + Math.min(20, velocidad / 2));
      ultimo = { x: e.clientX, y: e.clientY };
    }

    function dibujar() {
      // Desvanece poco a poco lo anterior: así queda la estela.
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.fillStyle = "rgba(0, 0, 0, 0.045)";
      ctx!.fillRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";

      frame++;
      // Latido lento de calma en el centro, aunque el cursor no se mueva.
      if (frame % 40 === 0) {
        emitir(w * (0.5 + 0.3 * Math.sin(frame / 300)), h * (0.5 + 0.25 * Math.cos(frame / 380)), 0, 0, 1, 26);
      }

      for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        // Campo de flujo: el ángulo cambia con la posición y el tiempo.
        const angulo = Math.sin(p.x * 0.004 + frame * 0.008) + Math.cos(p.y * 0.005 - frame * 0.006);
        p.vx = (p.vx + Math.cos(angulo * Math.PI) * 0.02) * 0.965;
        p.vy = (p.vy + Math.sin(angulo * Math.PI) * 0.02) * 0.965;
        p.x += p.vx;
        p.y += p.vy;
        p.vida -= 0.0065;

        if (p.vida <= 0 || p.x < -60 || p.y < -60 || p.x > w + 60 || p.y > h + 60) {
          particulas.splice(i, 1);
          continue;
        }

        const radio = p.r * (0.6 + p.vida * 0.4);
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, radio);
        g.addColorStop(0, `hsla(${p.hue}, 85%, 72%, ${0.32 * p.vida})`);
        g.addColorStop(1, `hsla(${p.hue}, 85%, 72%, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, radio, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(dibujar);
    }

    ajustar();
    window.addEventListener("resize", ajustar);
    window.addEventListener("pointermove", alMover);
    raf = requestAnimationFrame(dibujar);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", ajustar);
      window.removeEventListener("pointermove", alMover);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-teal-50 to-violet-100" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
