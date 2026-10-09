// Ilustraciones originales en SVG: una casa-piña, una estrella de mar y una medusa.
// Son decorativas (aria-hidden) y se ocultan en pantallas pequeñas para no estorbar.

export function CasaPina({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 220" className={`pointer-events-none ${className}`}>
      {/* Hojas */}
      <path d="M80 6 C60 -8 40 4 46 22 C56 16 66 14 80 22 C94 14 104 16 114 22 C120 4 100 -8 80 6 Z" fill="#2f9e6b" />
      <path d="M80 10 L64 -4 M80 10 L96 -4 M80 10 L80 -10" stroke="#1f7a50" strokeWidth="3" />
      {/* Cuerpo de piña */}
      <ellipse cx="80" cy="132" rx="70" ry="84" fill="#f5b83d" stroke="#c98a1b" strokeWidth="4" />
      {/* Rejilla de piña */}
      {[-40, -20, 0, 20, 40].map((x) => (
        <path key={`d${x}`} d={`M${80 + x} 60 Q${80 + x * 1.3} 130 ${80 + x} 210`} stroke="#c98a1b" strokeWidth="3" fill="none" opacity="0.6" />
      ))}
      {[-30, 0, 30].map((y) => (
        <path key={`h${y}`} d={`M20 ${132 + y} Q80 ${132 + y + 14} 140 ${132 + y}`} stroke="#c98a1b" strokeWidth="3" fill="none" opacity="0.6" />
      ))}
      {/* Ventana redonda y puerta */}
      <circle cx="80" cy="96" r="18" fill="#7dd3fc" stroke="#0e7490" strokeWidth="4" />
      <rect x="62" y="158" width="36" height="52" rx="18" fill="#8b5a2b" stroke="#5b3a1a" strokeWidth="3" />
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
