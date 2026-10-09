export type Contexto =
  | "transporte"
  | "casa"
  | "universidad"
  | "practicas"
  | "tesis"
  | "otro";

export type Emocion =
  | "tranquilidad"
  | "alegria"
  | "tristeza"
  | "frustracion"
  | "preocupacion"
  | "agotamiento"
  | "otra";

export type Dificultad =
  | "exceso_tareas"
  | "falta_tiempo"
  | "presion_academica"
  | "problemas_personales"
  | "cansancio"
  | "otra";

export type Checkin = {
  contexto: Contexto;
  tension: number; // 1-5
  emocion: Emocion;
  energia: number; // 1-5
  concentracion: number; // 1-5
  dificultad: Dificultad;
};

export type ChatMensaje = {
  rol: "usuario" | "asistente";
  texto: string;
};
