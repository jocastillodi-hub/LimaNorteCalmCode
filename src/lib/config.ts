// Datos institucionales configurables. Vacíos = aún no verificados.
// No inventar teléfonos, correos ni enlaces: completarlos desde variables de entorno.
export const apoyoUCV = {
  url: process.env.NEXT_PUBLIC_UCV_PSICOLOGIA_URL ?? "",
  contacto: process.env.NEXT_PUBLIC_UCV_PSICOLOGIA_CONTACTO ?? "",
};

export const emergencia = process.env.NEXT_PUBLIC_EMERGENCIA_CONTACTO ?? "";
