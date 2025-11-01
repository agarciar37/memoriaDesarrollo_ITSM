import { Handlers, PageProps } from "$fresh/server.ts";
import { ObjectId } from "npm:mongodb";
import IncidenciasManager from "../islands/IncidenciasManager.tsx";
import { incidencias } from "../utils.ts";
import type { EstadoIncidencia, Incidencia, Prioridad } from "../types.ts";

interface IncidenciaDocument {
  _id: ObjectId;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: EstadoIncidencia;
  fecha_creacion: Date;
  fecha_cierre?: Date | null;
  tecnico_asignado?: string | null;
}

const mapToIncidencia = (doc: IncidenciaDocument): Incidencia => ({
  _id: doc._id.toString(),
  titulo: doc.titulo,
  descripcion: doc.descripcion,
  prioridad: doc.prioridad,
  estado: doc.estado,
  fecha_creacion: doc.fecha_creacion.toISOString(),
  fecha_cierre: doc.fecha_cierre ? doc.fecha_cierre.toISOString() : null,
  tecnico_asignado: doc.tecnico_asignado ?? undefined,
});

export const handler: Handlers<Incidencia[]> = {
  async GET(_req, ctx) {
    const docs = await incidencias
      .find<IncidenciaDocument>({})
      .sort({ fecha_creacion: -1 })
      .toArray();

    return ctx.render(docs.map(mapToIncidencia));
  },
};

export default function Home({ data }: PageProps<Incidencia[]>) {
  return (
    <main class="min-h-screen bg-slate-100">
        <header class="bg-emerald-600 py-12 text-white">
          <div class="max-w-5xl mx-auto px-4">
            <p class="uppercase tracking-wide text-sm font-semibold text-emerald-200">
              Prototipo ITSM - Memoria de prácticas
            </p>
            <h1 class="mt-2 text-3xl sm:text-4xl font-bold">
              Gestión de incidencias simplificada
            </h1>
            <p class="mt-3 text-emerald-100 max-w-2xl">
              Crea, visualiza y actualiza incidencias inspiradas en ServiceNow. Las
              incidencias de prioridad alta se asignan automáticamente al técnico
              principal y el cierre registra la fecha correspondiente.
            </p>
          </div>
        </header>

        <div class="max-w-5xl mx-auto px-4 py-10">
          <IncidenciasManager incidenciasIniciales={data} />
        </div>
        </main>
  );
}