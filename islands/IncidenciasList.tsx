// islands/IncidenciasList.tsx
import { useState } from "preact/hooks";
import { Incidencia } from "../types.ts";

interface Props {
  incidencias: Incidencia[];
}

export default function IncidenciasList({ incidencias }: Props) {
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [prioridadFiltro, setPrioridadFiltro] = useState("todas");

  const filtrar = (i: Incidencia) => {
    const matchEstado =
      estadoFiltro === "todos" || i.estado === estadoFiltro;
    const matchPrioridad =
      prioridadFiltro === "todas" || i.prioridad === prioridadFiltro;
    return matchEstado && matchPrioridad;
  };

  const resultados = incidencias.filter(filtrar);

  const resetFiltros = () => {
    setEstadoFiltro("todos");
    setPrioridadFiltro("todas");
  };

  return (
    <div class="space-y-6">
      {/* 🎯 Barra de filtros */}
      <div class="flex flex-wrap gap-4 items-center mb-4 bg-white shadow-sm p-4 rounded-lg border">
        <div>
          <label class="text-sm font-medium text-gray-700 mr-2">Estado:</label>
          <select
            class="border rounded p-1 focus:ring-2 focus:ring-blue-400"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.currentTarget.value)}
          >
            <option value="todos">Todos</option>
            <option value="abierta">Abierta</option>
            <option value="en curso">En curso</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 mr-2">
            Prioridad:
          </label>
          <select
            class="border rounded p-1 focus:ring-2 focus:ring-blue-400"
            value={prioridadFiltro}
            onChange={(e) => setPrioridadFiltro(e.currentTarget.value)}
          >
            <option value="todas">Todas</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <button
          onClick={resetFiltros}
          class="ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          🔄 Restablecer
        </button>
      </div>

      {/* 🏷️ Chips de filtros activos */}
      {(estadoFiltro !== "todos" || prioridadFiltro !== "todas") && (
        <div class="flex flex-wrap gap-2 mb-4">
          {estadoFiltro !== "todos" && (
            <span
              class={`px-3 py-1 rounded-full text-sm font-medium ${
                estadoFiltro === "abierta"
                  ? "bg-green-100 text-green-700"
                  : estadoFiltro === "en curso"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Estado: {estadoFiltro}
            </span>
          )}

          {prioridadFiltro !== "todas" && (
            <span
              class={`px-3 py-1 rounded-full text-sm font-medium ${
                prioridadFiltro === "alta"
                  ? "bg-red-100 text-red-700"
                  : prioridadFiltro === "media"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Prioridad: {prioridadFiltro}
            </span>
          )}
        </div>
      )}

      {/* 📋 Resultados */}
      <p class="text-sm text-gray-500 mb-2">
        Mostrando {resultados.length} de {incidencias.length} incidencias
      </p>

      {resultados.length === 0
        ? <p class="text-gray-500">No hay incidencias que coincidan.</p>
        : (
          <ul class="grid gap-4">
            {resultados.map((i) => (
              <li
                key={i._id?.$oid}
                class={`p-4 rounded-lg shadow bg-white ${
                  i.prioridad === "alta"
                    ? "border-l-8 border-red-500"
                    : i.prioridad === "media"
                    ? "border-l-8 border-yellow-400"
                    : "border-l-8 border-green-400"
                }`}
              >
                <div class="flex justify-between items-start">
                  <h3 class="text-xl font-bold">{i.titulo}</h3>
                  <span
                    class={`px-2 py-1 text-xs rounded-full font-medium ${
                      i.estado === "abierta"
                        ? "bg-green-100 text-green-700"
                        : i.estado === "en curso"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {i.estado.toUpperCase()}
                  </span>
                </div>

                <p class="text-gray-700 mt-1">{i.descripcion}</p>
                <p class="text-sm text-gray-500 mt-1">
                  Prioridad: <b>{i.prioridad}</b>{" "}
                  {i.tecnico && (
                    <>| Técnico: <b>{i.tecnico}</b></>
                  )}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  Creado el: {new Date(i.fecha_creacion).toLocaleString()}
                </p>
                {i.fecha_cierre && (
                  <p class="text-xs text-green-600 mt-1">
                    ✅ Cerrada el: {new Date(i.fecha_cierre).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
