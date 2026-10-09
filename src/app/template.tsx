// A diferencia de layout, template se vuelve a montar en cada navegación:
// así cada pantalla entra con una transición suave (fade + slide-up).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="entrada">{children}</div>;
}
