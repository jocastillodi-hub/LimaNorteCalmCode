import Tarjeta from "@/components/Tarjeta";
import { apoyoUCV, emergencia } from "@/lib/config";

export default function Apoyo() {
  const urlDisponible = apoyoUCV.url.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">Apoyo psicológico</h1>
        <p className="mt-2 text-slate-600">Pedir ayuda profesional es un gesto de cuidado, no de debilidad.</p>
      </div>

      <Tarjeta titulo="Servicio de Psicología de la UCV">
        {urlDisponible ? (
          <a
            href={apoyoUCV.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-teal-600 px-5 py-3 font-medium text-white hover:bg-teal-700"
          >
            Ir al Servicio de Psicología UCV
          </a>
        ) : (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-amber-800">
            El enlace oficial aún no está configurado. Se completará cuando se verifique el canal oficial de la UCV.
          </p>
        )}
        {apoyoUCV.contacto && <p className="mt-4 text-slate-700">Contacto: {apoyoUCV.contacto}</p>}
      </Tarjeta>

      <Tarjeta titulo="Hablar con alguien de confianza">
        <p>Puedes contarle a una persona cercana cómo te sientes. No tienes que explicarlo perfecto: basta con decir “últimamente estoy muy cargado/a y quiero hablarlo”.</p>
      </Tarjeta>

      <Tarjeta titulo="Si sientes peligro ahora">
        <p className="font-medium text-rose-800">
          Si estás en peligro o podrías hacerte daño, busca ayuda inmediata: contacta a los servicios de emergencia de tu zona o acude a la persona más cercana.
        </p>
        {emergencia ? (
          <p className="mt-3">Emergencias: {emergencia}</p>
        ) : (
          <p className="mt-3 text-sm text-slate-500">El número de emergencias de tu país aún debe configurarse (variable NEXT_PUBLIC_EMERGENCIA_CONTACTO).</p>
        )}
      </Tarjeta>

      <p className="text-center text-sm text-slate-500">
        Esta plataforma es una herramienta automatizada. No reemplaza a un psicólogo ni a un servicio de emergencia.
      </p>
    </div>
  );
}
