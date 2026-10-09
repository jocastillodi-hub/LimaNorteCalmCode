"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Tarjeta from "@/components/Tarjeta";
import { crearTablero, fraseAleatoria, PARES_CONCHAS, type Carta } from "@/lib/diversion";

// Sección de descanso: sin tiempo, sin puntaje y sin forma de perder.
export default function Diversion() {
  const [frase, setFrase] = useState("");
  useEffect(() => setFrase(fraseAleatoria()), []);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-sky-900">🎈 Rato de juego</h1>
        <p className="mt-2 text-slate-600">Sin tiempo, sin puntaje. Juega solo lo que te haga bien.</p>
      </div>

      {frase && <p className="rounded-3xl bg-white/85 px-5 py-4 text-center font-semibold text-sky-900 shadow-sm">{frase}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta titulo="🫧 Pompas que suben">
          <JuegoBurbujas />
        </Tarjeta>
        <Tarjeta titulo="🐚 Memoria de conchas">
          <JuegoMemoria />
        </Tarjeta>
      </div>

      <div className="flex justify-center">
        <Link href="/pausa" className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-3 font-bold text-white hover:bg-sky-600">
          🫧 Ir a respirar un momento
        </Link>
      </div>
    </div>
  );
}

type Pompa = { id: number; izquierda: number; duracion: number; retraso: number; tamano: number };

function JuegoBurbujas() {
  const [pompas, setPompas] = useState<Pompa[]>([]);
  const [explotadas, setExplotadas] = useState(0);

  // Se generan en el navegador para que el servidor y el cliente no discrepen.
  function generar() {
    setExplotadas(0);
    setPompas(
      Array.from({ length: 14 }, (_, id) => ({
        id,
        izquierda: Math.round(Math.random() * 90),
        duracion: 9 + Math.round(Math.random() * 7),
        retraso: -Math.round(Math.random() * 10),
        tamano: 24 + Math.round(Math.random() * 30),
      })),
    );
  }

  useEffect(() => {
    generar();
  }, []);

  function explotar(id: number) {
    setPompas((prev) => prev.filter((p) => p.id !== id));
    setExplotadas((n) => n + 1);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-cyan-200">
        {pompas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => explotar(p.id)}
            aria-label="Explotar pompa"
            className="burbuja absolute bottom-[-40px] rounded-full border-2 border-white/80 bg-white/40 shadow-inner transition hover:scale-110"
            style={{ left: `${p.izquierda}%`, width: p.tamano, height: p.tamano, animationDuration: `${p.duracion}s`, animationDelay: `${p.retraso}s` }}
          />
        ))}
        {pompas.length === 0 && (
          <p className="flex h-full items-center justify-center text-slate-600">¡Todas las pompas volaron! 🎉</p>
        )}
      </div>
      <p className="text-sm text-slate-600">Pompas tocadas: {explotadas}</p>
      {pompas.length === 0 && (
        <button type="button" onClick={generar} className="self-start rounded-xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 font-bold text-white">
          Otra ronda
        </button>
      )}
    </div>
  );
}

function JuegoMemoria() {
  const [tablero, setTablero] = useState<Carta[]>([]);
  const [abiertas, setAbiertas] = useState<number[]>([]);
  const [movimientos, setMovimientos] = useState(0);

  function nuevo() {
    setTablero(crearTablero(PARES_CONCHAS.slice(0, 6)));
    setAbiertas([]);
    setMovimientos(0);
  }

  useEffect(() => {
    nuevo();
  }, []);

  // Al abrir dos cartas: si coinciden se quedan resueltas; si no, se vuelven a cubrir.
  useEffect(() => {
    if (abiertas.length !== 2) return;
    const [a, b] = abiertas;
    const coinciden = tablero[a]?.simbolo === tablero[b]?.simbolo;
    const id = setTimeout(() => {
      setTablero((t) =>
        t.map((c) =>
          coinciden && (c.id === a || c.id === b)
            ? { ...c, resuelta: true }
            : c.id === a || c.id === b
              ? { ...c, descubierta: false }
              : c,
        ),
      );
      setAbiertas([]);
    }, 700);
    setMovimientos((m) => m + 1);
    return () => clearTimeout(id);
    // Solo reacciona al cambio de las dos cartas abiertas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abiertas]);

  function voltear(carta: Carta) {
    if (carta.descubierta || carta.resuelta || abiertas.length === 2) return;
    setTablero((t) => t.map((c) => (c.id === carta.id ? { ...c, descubierta: true } : c)));
    setAbiertas((a) => [...a, carta.id]);
  }

  const terminado = tablero.length > 0 && tablero.every((c) => c.resuelta);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
        {tablero.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => voltear(c)}
            aria-label={c.descubierta || c.resuelta ? `Carta ${c.simbolo}` : "Carta oculta"}
            className={`flex aspect-square items-center justify-center rounded-2xl border-b-4 text-3xl transition ${
              c.resuelta ? "border-emerald-300 bg-emerald-100" : c.descubierta ? "border-sky-300 bg-white" : "border-sky-600 bg-sky-400 text-sky-400 hover:bg-sky-300"
            }`}
          >
            {c.descubierta || c.resuelta ? c.simbolo : "🫧"}
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-600" aria-live="polite">
        {terminado ? `¡Lo lograste en ${movimientos} movimientos! 🎉` : `Movimientos: ${movimientos}`}
      </p>
      <button type="button" onClick={nuevo} className="self-start rounded-xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 font-bold text-white">
        Nuevo tablero
      </button>
    </div>
  );
}
