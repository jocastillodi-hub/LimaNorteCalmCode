// Datos de apoyo. Los valores por defecto vienen de la configuración del proyecto;
// las variables de entorno (NEXT_PUBLIC_*) pueden cambiarlos sin tocar el código.
export const apoyoUCV = {
  nombre: "🏥 Servicio de Psicología UCV",
  url: process.env.NEXT_PUBLIC_UCV_PSICOLOGIA_URL || "https://trilce.ucv.edu.pe",
  contacto: process.env.NEXT_PUBLIC_UCV_PSICOLOGIA_CONTACTO ?? "",
};

export const emergencia = {
  numero: process.env.NEXT_PUBLIC_EMERGENCIA_CONTACTO || "113",
  etiqueta: "📞 Llamar al 113 (MINSA, Opción 5)",
};
