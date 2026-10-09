// Caracolito original: camina despacio de un lado a otro por la parte inferior.
// Es un diseño propio (no es un personaje de la serie). Se puede cambiar por un
// GIF/WebP tuyo en public/ reemplazando el SVG por <img src="/assets/caracol.gif" />.
export default function Caracol() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-1 left-0 z-0 w-20 sm:w-24">
      <div className="caracol-camina">
        <svg viewBox="0 0 120 90" className="caracol-cuerpo h-auto w-full">
          {/* Cuerpo */}
          <path d="M14 70 Q10 50 30 48 L86 48 Q104 50 104 68 Q104 76 92 76 L24 76 Q14 76 14 70 Z" fill="#86efac" stroke="#15803d" strokeWidth="3" />
          {/* Antenas con ojos */}
          <path d="M84 50 Q86 30 96 22" stroke="#15803d" strokeWidth="3" fill="none" />
          <path d="M96 50 Q100 34 108 30" stroke="#15803d" strokeWidth="3" fill="none" />
          <circle cx="96" cy="20" r="5" fill="#fff" stroke="#15803d" strokeWidth="2" />
          <circle cx="108" cy="28" r="5" fill="#fff" stroke="#15803d" strokeWidth="2" />
          <circle cx="97" cy="21" r="2" fill="#1e293b" />
          <circle cx="109" cy="29" r="2" fill="#1e293b" />
          {/* Concha en espiral */}
          <circle cx="50" cy="36" r="26" fill="#fb923c" stroke="#c2410c" strokeWidth="4" />
          <path d="M50 36 m-12 0 a12 12 0 1 1 12 12 a18 18 0 1 0 -18 -18" fill="none" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
