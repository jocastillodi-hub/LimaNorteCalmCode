const jugadores = [
  { nombre: "Carlos Mendoza", posicion: "Delantero", equipo: "Universitario", goles: 12 },
  { nombre: "Luis Ramírez", posicion: "Mediocampista", equipo: "Alianza Lima", goles: 4 },
  { nombre: "Diego Flores", posicion: "Defensa", equipo: "Sporting Cristal", goles: 1 },
  { nombre: "Andrés Quispe", posicion: "Portero", equipo: "Melgar", goles: 0 },
  { nombre: "Miguel Torres", posicion: "Delantero", equipo: "Sport Boys", goles: 9 },
];

export default function Jugadores() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-teal-800">Tabla de jugadores</h1>
      <div className="overflow-x-auto rounded-2xl border border-teal-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Posición</th>
              <th className="px-4 py-3 font-medium">Equipo</th>
              <th className="px-4 py-3 text-right font-medium">Goles</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((j) => (
              <tr key={j.nombre} className="border-t border-teal-100">
                <td className="px-4 py-3">{j.nombre}</td>
                <td className="px-4 py-3">{j.posicion}</td>
                <td className="px-4 py-3">{j.equipo}</td>
                <td className="px-4 py-3 text-right">{j.goles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
