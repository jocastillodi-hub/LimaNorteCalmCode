// Detección simple y orientativa de expresiones de riesgo inmediato.
// No sustituye la evaluación humana: solo activa un mensaje de derivación.
// Se normaliza el texto (minúsculas, sin tildes) para que las variantes coincidan.
const patrones = [
  /suicid/,
  /quitarme la vida|quitarmela vida|quitarme mi vida/,
  /acabar con (mi|mi propia) vida|acabar con todo/,
  /quiero morir|no quiero (seguir )?vivir|no quiero seguir viviendo/,
  /hacerme dano|lastimarme|autolesi/,
  /cortarme (las venas|la piel)/,
];

export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function haySenalDeRiesgo(texto: string) {
  const t = normalizar(texto);
  return patrones.some((p) => p.test(t));
}
