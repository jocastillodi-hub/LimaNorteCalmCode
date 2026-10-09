// Detección simple y orientativa de expresiones de riesgo inmediato.
// No sustituye la evaluación humana: solo activa un mensaje de derivación.
const patrones = [
  /suicid/i,
  /quitarme la vida/i,
  /matarme/i,
  /no quiero vivir/i,
  /hacerme da[ñn]o/i,
  /autolesi/i,
  /cortarme/i,
  /no aguanto más/i,
];

export function haySenalDeRiesgo(texto: string) {
  return patrones.some((p) => p.test(texto));
}
