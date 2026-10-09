const jugadores = [
  { nombre: "Carlos Mendoza", posicion: "Delantero", equipo: "Universitario", goles: 12 },
  { nombre: "Luis Ramírez", posicion: "Mediocampista", equipo: "Alianza Lima", goles: 4 },
  { nombre: "Diego Flores", posicion: "Defensa", equipo: "Sporting Cristal", goles: 1 },
  { nombre: "Andrés Quispe", posicion: "Portero", equipo: "Melgar", goles: 0 },
  { nombre: "Miguel Torres", posicion: "Delantero", equipo: "Sport Boys", goles: 9 },
];

const celda = { padding: "0.5rem 1rem", borderBottom: "1px solid #99f6e4", textAlign: "left" as const };

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
        background: "#f0fdfa",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#0f766e", margin: 0 }}>UCV</h1>

      <table style={{ borderCollapse: "collapse", background: "#ffffff", color: "#134e4a" }}>
        <thead>
          <tr style={{ background: "#0f766e", color: "#ffffff" }}>
            <th style={celda}>Nombre</th>
            <th style={celda}>Posición</th>
            <th style={celda}>Equipo</th>
            <th style={{ ...celda, textAlign: "right" }}>Goles</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((j) => (
            <tr key={j.nombre}>
              <td style={celda}>{j.nombre}</td>
              <td style={celda}>{j.posicion}</td>
              <td style={celda}>{j.equipo}</td>
              <td style={{ ...celda, textAlign: "right" }}>{j.goles}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
