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

export type Checkin = {
  contexto: Contexto;
  tension: number; // 1-5
  emocion: Emocion;
};

export type ChatMensaje = {
  rol: "usuario" | "asistente";
  texto: string;
};
