import { useState } from "preact/hooks";
import type { Incidencia, Prioridad } from "../types.ts";

type FormState = {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
};

type Props = {
  incidenciasIniciales: Incidencia[];
};

const prioridadOptions: Prioridad[] = ["alta", "media", "baja"];

export default function IncidenciasManager({ incidenciasIniciales }: Props) {
  const [form, setForm] = useState<FormState>({
    titulo: "",
    descripcion: "",
    prioridad: "media",
  });
  const [incidencias, setIncidencias] = useState<Incidencia[]>(incidenciasIniciales);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarCampo = <K extends keyof FormState>(
    campo: K,
    valor: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const respuesta = await fetch("/api/incidencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => ({}));
        throw new Error(detalle.error ?? "No se pudo crear la incidencia");
      }

      const nuevaIncidencia: Incidencia = await respuesta.json();
      setIncidencias((prev) => [nuevaIncidencia, ...prev]);
      setForm({ titulo: "", descripcion: "", prioridad: "media" });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  const cerrarIncidencia = async (id: string) => {
    setError(null);
    try {
      const respuesta = await fetch("/api/incidencias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: "cerrada" }),
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => ({}));
        throw new Error(detalle.error ?? "No se pudo actualizar la incidencia");
      }

      const actualizada: Incidencia = await respuesta.json();
      setIncidencias((prev) =>
        prev.map((incidencia) =>
          incidencia._id === id ? actualizada : incidencia
        )
      );
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div class="space-y-8">
      <section class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Crear nueva incidencia</h2>
        <form class="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label class="block text-sm font-medium text-gray-700" htmlFor="titulo">
              Título
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.titulo}
              onInput={(event) =>
                actualizarCampo(
                  "titulo",
                  (event.target as HTMLInputElement).value,
                )
              }
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={4}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.descripcion}
              onInput={(event) =>
                actualizarCampo(
                  "descripcion",
                  (event.target as HTMLTextAreaElement).value,
                )
              }
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700" htmlFor="prioridad">
              Prioridad
            </label>
            <select
              id="prioridad"
              name="prioridad"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.prioridad}
              onInput={(event) =>
                actualizarCampo(
                  "prioridad",
                  (event.target as HTMLSelectElement).value as Prioridad,
                )
              }
            >
              {prioridadOptions.map((valor) => (
                <option key={valor} value={valor}>
                  {valor.charAt(0).toUpperCase() + valor.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={cargando}
          >
            {cargando ? "Creando..." : "Crear incidencia"}
          </button>
        </form>
        {error && (
          <p class="mt-4 text-sm text-red-600">{error}</p>
        )}
      </section>

      <section class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Incidencias registradas</h2>
        {incidencias.length === 0 ? (
          <p class="text-gray-600">Todavía no hay incidencias registradas.</p>
        ) : (
          <ul class="space-y-4">
            {incidencias.map((incidencia) => {
              const fechaCreacion = new Date(incidencia.fecha_creacion).toLocaleString();
              const fechaCierre = incidencia.fecha_cierre
                ? new Date(incidencia.fecha_cierre).toLocaleString()
                : null;
              return (
                <li
                  key={incidencia._id}
                  class="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 class="text-lg font-semibold">{incidencia.titulo}</h3>
                    <span
                      class={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        incidencia.prioridad === "alta"
                          ? "bg-red-100 text-red-800"
                          : incidencia.prioridad === "media"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      Prioridad: {incidencia.prioridad}
                    </span>
                  </div>
                  <p class="mt-2 text-gray-700">{incidencia.descripcion}</p>
                  <dl class="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                    <div>
                      <dt class="font-medium text-gray-800">Estado</dt>
                      <dd class="capitalize">{incidencia.estado}</dd>
                    </div>
                    <div>
                      <dt class="font-medium text-gray-800">Fecha de creación</dt>
                      <dd>{fechaCreacion}</dd>
                    </div>
                    {incidencia.tecnico_asignado && (
                      <div>
                        <dt class="font-medium text-gray-800">Técnico asignado</dt>
                        <dd>{incidencia.tecnico_asignado}</dd>
                      </div>
                    )}
                    {fechaCierre && (
                      <div>
                        <dt class="font-medium text-gray-800">Fecha de cierre</dt>
                        <dd>{fechaCierre}</dd>
                      </div>
                    )}
                  </dl>
                  <div class="mt-4 flex gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                      disabled={incidencia.estado === "cerrada"}
                      onClick={() => cerrarIncidencia(incidencia._id)}
                    >
                      Marcar como cerrada
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}