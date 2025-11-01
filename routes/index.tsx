// routes/index.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { incidencias } from "../utils/db.ts";
import { Incidencia } from "../types.ts";
import IncidenciasList from "../islands/IncidenciasList.tsx"; // 👈 nuevo import

interface Dashboard {
  total: number;
  abiertas: number;
  enCurso: number;
  cerradas: number;
}

export const handler: Handlers = {
  async GET(_, ctx) {
    const data = await incidencias.find({}).toArray();

    const dashboard: Dashboard = {
      total: data.length,
      abiertas: data.filter((i) => i.estado === "abierta").length,
      enCurso: data.filter((i) => i.estado === "en curso").length,
      cerradas: data.filter((i) => i.estado === "cerrada").length,
    };

    return ctx.render({ data, dashboard });
  },

  async POST(req) {
    const form = await req.formData();
    const titulo = form.get("titulo")?.toString() || "";
    const descripcion = form.get("descripcion")?.toString() || "";
    const prioridad = form.get("prioridad")?.toString() as
      | "baja"
      | "media"
      | "alta";

    if (!titulo || !descripcion || !prioridad) {
      return new Response("❌ Faltan campos obligatorios", { status: 400 });
    }

    const nueva: Omit<Incidencia, "_id"> = {
      titulo,
      descripcion,
      prioridad,
      estado: "abierta",
      fecha_creacion: new Date(),
    };

    if (prioridad === "alta") nueva.tecnico = "Técnico principal";

    await incidencias.insertOne(nueva);

    return new Response("", {
      status: 303,
      headers: { Location: "/" },
    });
  },
};

export default function Home(
  { data }: PageProps<{ data: Incidencia[]; dashboard: Dashboard }>,
) {
  const dashboard = (data as any).dashboard as Dashboard;
  const incidenciasData = (data as any).data as Incidencia[];

  return (
    <div class="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 class="text-3xl font-bold mb-8 text-blue-700 text-center">
        🧾 Gestión de Incidencias ITSM
      </h1>

      {/* 📊 Panel de métricas */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <div class="bg-white shadow rounded-lg p-4 border-t-4 border-blue-500">
          <p class="text-gray-500 text-sm">Total</p>
          <h2 class="text-2xl font-bold text-blue-700">{dashboard.total}</h2>
        </div>
        <div class="bg-white shadow rounded-lg p-4 border-t-4 border-green-500">
          <p class="text-gray-500 text-sm">Abiertas</p>
          <h2 class="text-2xl font-bold text-green-600">{dashboard.abiertas}</h2>
        </div>
        <div class="bg-white shadow rounded-lg p-4 border-t-4 border-yellow-400">
          <p class="text-gray-500 text-sm">En curso</p>
          <h2 class="text-2xl font-bold text-yellow-500">
            {dashboard.enCurso}
          </h2>
        </div>
        <div class="bg-white shadow rounded-lg p-4 border-t-4 border-red-500">
          <p class="text-gray-500 text-sm">Cerradas</p>
          <h2 class="text-2xl font-bold text-red-600">{dashboard.cerradas}</h2>
        </div>
      </div>

      {/* 📝 Formulario */}
      <form
        method="POST"
        class="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col gap-3 max-w-lg mx-auto"
      >
        <input
          name="titulo"
          placeholder="Título"
          class="border p-2 rounded-md"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          class="border p-2 rounded-md"
          required
        />
        <select name="prioridad" class="border p-2 rounded-md" required>
          <option value="">Seleccionar prioridad</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <button
          type="submit"
          class="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          ➕ Crear incidencia
        </button>
      </form>

      {/* 🧩 Listado interactivo */}
      <IncidenciasList incidencias={incidenciasData} />
    </div>
  );
}
