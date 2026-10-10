import type { Metadata } from "next";
import "./globals.css";
import Escenario from "@/components/Escenario";
import IntroSplash from "@/components/IntroSplash";
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
          <IntroSplash />
          <Escenario>
            <Nav />
            <main className="relative z-0 mx-auto max-w-5xl px-4 py-6 pb-40 sm:py-8">
              {children}
              <footer className="mt-10 flex justify-center">
                <p className="rounded-full bg-white/80 px-4 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                  Esta herramienta apoya, no diagnostica.
                </p>
              </footer>
            </main>
          </Escenario>
        </SesionProvider>
      </body>
    </html>
  );
}
