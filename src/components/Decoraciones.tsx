// Ilustraciones originales en SVG: una casa-piña, una estrella de mar y una medusa.
// Son decorativas (aria-hidden) y se ocultan en pantallas pequeñas para no estorbar.

export function CasaPina({ className = "" }: { className?: string }) {
  // Ilustración propia: casa-piña con chimenea de tubo, escotilla metálica,
  // ventanas redondas y hojas arriba. Estilo amigable y de colores cálidos.
  const remaches = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg aria-hidden="true" viewBox="0 0 200 260" className={`pointer-events-none ${className}`}>
      {/* Hojas */}
      <path d="M100 42 C78 24 62 10 46 14 C58 26 70 36 100 44 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
      <path d="M100 42 C122 24 138 10 154 14 C142 26 130 36 100 44 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
      <path d="M100 40 C88 18 88 2 100 -6 C112 2 112 18 100 40 Z" fill="#4ade80" stroke="#15803d" strokeWidth="3" />
      <path d="M100 40 C72 40 58 52 60 66 C76 60 88 52 100 44 Z" fill="#4ade80" stroke="#15803d" strokeWidth="3" />
      <path d="M100 40 C128 40 142 52 140 66 C124 60 112 52 100 44 Z" fill="#4ade80" stroke="#15803d" strokeWidth="3" />

      {/* Chimenea de tubo */}
      <rect x="138" y="34" width="20" height="62" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
      <rect x="134" y="28" width="28" height="10" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />

      {/* Cuerpo de piña */}
      <ellipse cx="100" cy="150" rx="78" ry="98" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
      {/* Rejilla de piña */}
      <g stroke="#ca8a04" strokeWidth="2.5" opacity="0.45" fill="none">
        <path d="M40 90 L160 210" />
        <path d="M30 130 L150 250" />
        <path d="M60 60 L180 180" />
        <path d="M160 70 L40 190" />
        <path d="M170 110 L50 230" />
        <path d="M120 40 L20 140" />
      </g>

      {/* Ventanas redondas */}
      {[[68, 118], [132, 118]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="22" fill="#bfdbfe" stroke="#f8fafc" strokeWidth="9" />
          <circle cx={x} cy={y} r="22" fill="none" stroke="#0e7490" strokeWidth="3" />
          <path d={`M${x - 12} ${y - 4} L${x + 8} ${y - 14}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </g>
      ))}

      {/* Escotilla de metal con remaches */}
      <circle cx="100" cy="200" r="30" fill="#64748b" stroke="#334155" strokeWidth="6" />
      <circle cx="100" cy="200" r="20" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
      {remaches.map((a) => (
        <circle key={a} cx={100 + Math.cos((a * Math.PI) / 180) * 26} cy={200 + Math.sin((a * Math.PI) / 180) * 26} r="2.6" fill="#e2e8f0" />
      ))}
      <path d="M100 186 L100 214 M86 200 L114 200" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="200" r="6" fill="#94a3b8" stroke="#334155" strokeWidth="2" />

      {/* Base */}
      <rect x="44" y="244" width="112" height="10" rx="5" fill="#a16207" opacity="0.6" />
    </svg>
  );
}

export function EstrellaDeMar({ className = "" }: { className?: string }) {
  const puntos = Array.from({ length: 10 }, (_, i) => {
    const angulo = (Math.PI / 5) * i - Math.PI / 2;
    const radio = i % 2 === 0 ? 60 : 26;
    return `${(80 + radio * Math.cos(angulo)).toFixed(1)},${(80 + radio * Math.sin(angulo)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg aria-hidden="true" viewBox="0 0 160 160" className={`reacciona cursor-pointer ${className}`}>
      <polygon points={puntos} fill="#fb7185" stroke="#be123c" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="80" cy="82" r="5" fill="#fecdd3" />
      {[[70, 66], [90, 66], [80, 100]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#fecdd3" />
      ))}
      {/* Ojos y sonrisa */}
      <circle cx="72" cy="78" r="3.5" fill="#1e293b" />
      <circle cx="88" cy="78" r="3.5" fill="#1e293b" />
      <path d="M72 92 Q80 100 88 92" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Medusa({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 180" className={`pointer-events-none ${className}`}>
      <path d="M60 10 C18 10 10 60 14 82 C16 96 30 96 34 84 C40 64 80 64 86 84 C90 96 104 96 106 82 C110 60 102 10 60 10 Z" fill="#c4b5fd" opacity="0.85" stroke="#7c3aed" strokeWidth="2" />
      <circle cx="46" cy="44" r="5" fill="#1e293b" />
      <circle cx="74" cy="44" r="5" fill="#1e293b" />
      <path d="M48 62 Q60 72 72 62" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {[24, 42, 60, 78, 96].map((x, i) => (
        <path key={x} d={`M${x} 92 Q${x + (i % 2 ? 6 : -6)} 130 ${x} 170`} stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}
