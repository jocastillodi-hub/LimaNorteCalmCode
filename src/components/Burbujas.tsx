// Burbujas que suben lento. Los valores son deterministas (sin Math.random)
// para que el servidor y el navegador generen el mismo HTML.
const cantidad = 18;

const burbujas = Array.from({ length: cantidad }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    id: i,
    izquierda: Math.round(r(1) * 100),
    tamano: Math.round(10 + r(2) * 38),
    duracion: Math.round(14 + r(3) * 16),
    retraso: Math.round(r(4) * -20),
  };
});

export default function Burbujas() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {burbujas.map((b) => (
        <span
          key={b.id}
          className="burbuja absolute bottom-[-60px] rounded-full border border-white/70 bg-white/25 shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.6)]"
          style={{
            left: `${b.izquierda}%`,
            width: b.tamano,
            height: b.tamano,
            animationDuration: `${b.duracion}s`,
            animationDelay: `${b.retraso}s`,
          }}
        />
      ))}
    </div>
  );
}
