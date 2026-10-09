// "Profundidades del océano": aurora submarina con gradientes animados y plancton
// bioluminiscente que sube. Solo usa transform y opacity para mantener el rendimiento.
const planctonCantidad = 26;

const plancton = Array.from({ length: planctonCantidad }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 17.31 + n * 91.7) * 43758.5453) % 1 + 1) % 1;
  return {
    id: i,
    izquierda: Math.round(r(1) * 100),
    tamano: 2 + Math.round(r(2) * 3),
    duracion: Math.round(12 + r(3) * 14),
    retraso: Math.round(r(4) * -25),
  };
});

export default function FondoNoche({ activo }: { activo: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-[1500ms] ${activo ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#06152e] via-[#14124a] to-[#2a0f5c]" />
      <div className="aurora absolute -left-1/4 top-[-10%] h-[45%] w-[150%] bg-gradient-to-r from-cyan-400/40 via-emerald-300/30 to-transparent blur-3xl" />
      <div className="aurora-lenta absolute -right-1/4 top-[10%] h-[40%] w-[150%] bg-gradient-to-l from-violet-500/40 via-fuchsia-400/25 to-transparent blur-3xl" />
      <div className="aurora-rapida absolute left-1/4 top-[30%] h-[30%] w-[120%] bg-gradient-to-r from-sky-400/25 via-teal-300/20 to-transparent blur-3xl" />

      {plancton.map((p) => (
        <span
          key={p.id}
          className="plancton absolute bottom-[-20px] rounded-full bg-cyan-200 shadow-[0_0_8px_3px_rgba(103,232,249,0.6)]"
          style={{
            left: `${p.izquierda}%`,
            width: p.tamano,
            height: p.tamano,
            animationDuration: `${p.duracion}s`,
            animationDelay: `${p.retraso}s`,
          }}
        />
      ))}
    </div>
  );
}
