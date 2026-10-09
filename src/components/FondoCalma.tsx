// Fondo decorativo: degradados suaves, formas que flotan lento y ondas de calma.
// Es solo visual (aria-hidden) y se desactiva con "reducir movimiento" en el sistema.
export default function FondoCalma() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-teal-50 to-violet-50" />
      <div className="fondo-blob absolute -left-24 top-10 h-96 w-96 rounded-full bg-teal-200/50 blur-3xl" />
      <div className="fondo-blob-lento absolute -right-20 top-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-200/50 blur-3xl" />
      <div className="fondo-blob absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />

      {/* Círculos concéntricos: símbolo de calma y de respiración */}
      <svg className="absolute -right-16 -top-16 h-72 w-72 text-teal-300/40" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1">
        {[20, 40, 60, 80, 96].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} className="fondo-respira" style={{ animationDelay: `${r * 20}ms` }} />
        ))}
      </svg>

      {/* Ondas suaves en la parte inferior */}
      <svg className="absolute bottom-0 left-0 h-40 w-full text-teal-200/60" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path fill="currentColor" className="fondo-onda" d="M0,96 C240,160 480,32 720,96 C960,160 1200,32 1440,96 L1440,160 L0,160 Z" />
        <path fill="currentColor" className="fondo-onda-lenta opacity-60" d="M0,120 C300,60 600,160 900,120 C1100,90 1300,130 1440,110 L1440,160 L0,160 Z" />
      </svg>

      {/* Puntos suaves: sensación de calma sin saturar */}
      <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(circle,_#5eead4_1px,_transparent_1px)] [background-size:28px_28px]" />
    </div>
  );
}
