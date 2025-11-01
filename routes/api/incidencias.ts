// routes/api/incidencias.ts
import { Handlers } from "$fresh/server.ts";
import { incidencias } from "../../utils/db.ts";
import { Incidencia } from "../../types.ts";

export const handler: Handlers = {
  // 📩 POST → Crear nueva incidencia
  async POST(req) {
    try {
      const body: Incidencia = await req.json();

      if (!body.titulo || !body.descripcion || !body.prioridad) {
        return new Response(
          JSON.stringify({ error: "Faltan campos obligatorios" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      body.fecha_creacion = new Date();
      body.estado = "abierta";

      if (body.prioridad === "alta") {
        body.tecnico = "Técnico principal";
      }

      const { _id, ...doc } = body as any;
      await incidencias.insertOne(doc as any);

      return new Response(
        JSON.stringify({ message: "✅ Incidencia creada correctamente" }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("❌ Error al crear incidencia:", error);
      return new Response(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },

  // 📄 GET → Listar todas las incidencias
  async GET() {
    try {
      const data = await incidencias.find({}).toArray();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("❌ Error al listar incidencias:", error);
      return new Response(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },

  // 📤 PUT → Actualizar estado (cerrar incidencia)
  async PUT(req) {
    try {
      const { id, estado } = await req.json();

      if (!id || !estado) {
        return new Response(
          JSON.stringify({ error: "Faltan campos 'id' o 'estado'" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const updateData: any = { estado };
      if (estado === "cerrada") {
        updateData.fecha_cierre = new Date();
      }

      const { matchedCount } = await incidencias.updateOne(
        { _id: { $oid: id } },
        { $set: updateData },
      );

      if (!matchedCount) {
        return new Response(
          JSON.stringify({ error: "Incidencia no encontrada" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ message: "✅ Incidencia actualizada correctamente" }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("❌ Error al actualizar incidencia:", error);
      return new Response(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
};
