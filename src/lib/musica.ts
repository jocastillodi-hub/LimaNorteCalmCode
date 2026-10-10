import { useEffect, useSyncExternalStore } from "react";

// Música de fondo global: un único elemento de audio para toda la app.
const RUTA = "/bg-calma.mp3";
const VOLUMEN = 0.35;

let audio: HTMLAudioElement | null = null;
let silenciada = false;
const oyentes = new Set<() => void>();

function avisar() {
  oyentes.forEach((f) => f());
}

function obtenerAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(RUTA);
    audio.loop = true;
    audio.volume = VOLUMEN;
  }
  return audio;
}

function sincronizarMediaSession() {
  if (typeof navigator === "undefined" || !navigator.mediaSession) return;
  navigator.mediaSession.playbackState = silenciada ? "paused" : "playing";
}

// Debe llamarse dentro de un gesto del usuario (click) para que el navegador permita reproducir.
export function iniciarMusica() {
  try {
    const a = obtenerAudio();
    a.muted = silenciada;
    void a.play().catch(() => {
      // Si el archivo falta o el navegador lo bloquea, la app sigue funcionando en silencio.
    });
    sincronizarMediaSession();
  } catch {
    // Sin soporte de audio no hay nada que reproducir.
  }
}

export function alternarSilencio() {
  silenciada = !silenciada;
  if (audio) audio.muted = silenciada;
  sincronizarMediaSession();
  avisar();
}

function suscribir(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

function leerSilencio() {
  return silenciada;
}

// Estado de silencio para componentes de React (true = silenciada).
export function useSilenciada(): boolean {
  return useSyncExternalStore(suscribir, leerSilencio, () => false);
}

// Tecla M y teclas multimedia del teclado (play/pause) para alternar el silencio.
export function useControlesMusica() {
  useEffect(() => {
    function alPulsarTecla(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "m" || e.ctrlKey || e.metaKey || e.altKey) return;
      // No silenciar mientras el usuario escribe (por ejemplo, en el chat).
      const destino = e.target as HTMLElement | null;
      if (destino && (destino.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(destino.tagName))) return;
      alternarSilencio();
    }
    window.addEventListener("keydown", alPulsarTecla);

    const ms = typeof navigator !== "undefined" ? navigator.mediaSession : undefined;
    if (ms) {
      if (typeof MediaMetadata !== "undefined") {
        ms.metadata = new MediaMetadata({ title: "Mi Clima Interno", artist: "UCV · Bienestar" });
      }
      // Las teclas play/pause del teclado alternan el silencio. Solo tienen efecto si ya hay audio.
      const alternarSiHayAudio = () => {
        if (audio) alternarSilencio();
      };
      ms.setActionHandler("play", alternarSiHayAudio);
      ms.setActionHandler("pause", alternarSiHayAudio);
    }

    return () => {
      window.removeEventListener("keydown", alPulsarTecla);
      if (ms) {
        ms.setActionHandler("play", null);
        ms.setActionHandler("pause", null);
      }
    };
  }, []);
}
