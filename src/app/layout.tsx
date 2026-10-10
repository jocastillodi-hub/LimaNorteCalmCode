import type { Metadata } from "next";
import "./globals.css";
import Escenario from "@/components/Escenario";
import EntradaApp from "@/components/EntradaApp";
import Nav from "@/components/Nav";
import WelcomeScreen from "@/components/WelcomeScreen";
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
          <WelcomeScreen />
          <Escenario>
            <EntradaApp>
              <Nav />
              <main data-reveal className="relative z-0 mx-auto max-w-5xl px-4 py-6 pb-40 sm:py-8">
                {children}
                <footer className="mt-10 text-center text-[11px] font-medium tracking-wide text-sky-950/60">
                  Esta herramienta apoya, no diagnostica.
                </footer>
              </main>
            </EntradaApp>
          </Escenario>
        </SesionProvider>
      </body>
    </html>
  );
}
