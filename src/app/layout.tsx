import type { Metadata } from "next";
import "./globals.css";
import Escenario from "@/components/Escenario";
import Nav from "@/components/Nav";
import { SesionProvider } from "@/lib/session";

export const metadata: Metadata = {
  title: "UCV",
  description: "Bienestar emocional y apoyo académico para estudiantes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh font-sans text-slate-800 antialiased">
        <SesionProvider>
          <Escenario>
            <Nav />
            <main className="relative z-0 mx-auto max-w-5xl px-4 py-8 pb-28 sm:py-10">{children}</main>
            <footer className="relative z-0 pb-24 text-center text-xs text-sky-950/75">
              Esta herramienta apoya, no diagnostica.
            </footer>
          </Escenario>
        </SesionProvider>
      </body>
    </html>
  );
}
