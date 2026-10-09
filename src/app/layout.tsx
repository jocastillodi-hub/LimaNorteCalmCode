import type { Metadata } from "next";
import "./globals.css";
import FondoFluido from "@/components/FondoFluido";
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
        <FondoFluido />
        <SesionProvider>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">{children}</main>
        </SesionProvider>
      </body>
    </html>
  );
}
