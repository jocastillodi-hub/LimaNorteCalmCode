"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Tarjeta from "@/components/Tarjeta";
import { crearClienteSupabase } from "@/lib/supabase/cliente";

// Destino del enlace por correo: intercambia el código por una sesión y vuelve a Tareas.
export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const codigo = new URLSearchParams(window.location.search).get("code");
    if (!codigo) {
      setError("El enlace no es válido o ya venció. Pide uno nuevo desde Tareas.");
      return;
    }
    crearClienteSupabase()
      .auth.exchangeCodeForSession(codigo)
      .then(({ error: e }) => {
        if (e) setError("No pudimos iniciar tu sesión. Pide un enlace nuevo desde Tareas.");
        else router.replace("/tareas");
      });
  }, [router]);

  return (
    <div className="mx-auto max-w-md">
      <Tarjeta>
        {error ? <p className="text-rose-800">{error}</p> : <p className="text-slate-700">Iniciando tu sesión… 🫧</p>}
      </Tarjeta>
    </div>
  );
}
