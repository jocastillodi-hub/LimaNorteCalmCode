export type Contexto =
  | "transporte"
  | "casa"
  | "universidad"
  | "practicas"
  | "tesis";

export type Emocion =
  | "alegre"
  | "colera"
  | "triste"
  | "estresado"
  | "nostalgico"
  | "agotado";

export type Dificultad =
  | "exceso_tareas"
  | "falta_tiempo"
  | "presion_academica"
  | "problemas_personales"
  | "cansancio";

export type Clima = "soleado" | "nublado" | "lluvia" | "tormenta" | "arcoiris";

export type Checkin = {
  contexto: Contexto;
  tension: number; // 1-5
  emocion: Emocion;
  energia: number; // 1-5
  concentracion: number; // 1-5
  dificultad: Dificultad;
  clima?: Clima; // opcional: metáfora libre del día
};

export type ChatMensaje = {
  rol: "usuario" | "asistente";
  texto: string;
};
