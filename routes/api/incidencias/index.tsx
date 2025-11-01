import { Handlers } from "$fresh/server.ts";
import { ObjectId } from "npm:mongodb";
import { incidencias } from "../../../utils.ts";
import type { EstadoIncidencia, Incidencia, Prioridad } from "../../../types.ts";

type IncidenciaDocument = {
  _id: ObjectId;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: EstadoIncidencia;
  fecha_creacion: Date;
  fecha_cierre?: Date | null;
  tecnico_asignado?: string | null;
};

const toIncidenciaDto = (doc: IncidenciaDocument): Incidencia => ({
  _id: doc._id.toString(),
  titulo: doc.titulo,
  descripcion: doc.descripcion,
  prioridad: doc.prioridad,
  estado: doc.estado,
  fecha_creacion: doc.fecha_creacion.toISOString(),
  fecha_cierre: doc.fecha_cierre ? doc.fecha_cierre.toISOString() : null,
  tecnico_asignado: doc.tecnico_asignado ?? undefined,
});

export const handler: Handlers = {
  async GET() {
    const docs = await incidencias
      .find<IncidenciaDocument>({})
      .sort({ fecha_creacion: -1 })
      .toArray();

    const payload = docs.map(toIncidenciaDto);

    return new Response(JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async POST(req) {
    const body = await req.json();
    const { titulo, descripcion, prioridad } = body as {
      titulo?: string;
      descripcion?: string;
      prioridad?: Prioridad;
    };

    if (!titulo || !descripcion || !prioridad) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const now = new Date();
    const nuevaIncidencia: Omit<IncidenciaDocument, "_id"> = {
      titulo,
      descripcion,
      prioridad,
      estado: "abierta",
      fecha_creacion: now,
      fecha_cierre: null,
      tecnico_asignado: prioridad === "alta" ? "técnico principal" : null,
    };

    const result = await incidencias.insertOne(nuevaIncidencia);

    const respuesta: Incidencia = toIncidenciaDto({
      _id: result.insertedId,
      ...nuevaIncidencia,
    });

    return new Response(JSON.stringify(respuesta), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },

  async PUT(req) {
    const body = await req.json();
    const { id, ...data } = body as {
      id?: string;
      titulo?: string;
      descripcion?: string;
      prioridad?: Prioridad;
      estado?: EstadoIncidencia;
      tecnico_asignado?: string | null;
    };

    if (!id) {
      return new Response(JSON.stringify({ error: "Falta el identificador" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (_error) {
      return new Response(JSON.stringify({ error: "Identificador no válido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updates: Record<string, unknown> = {};

    if (typeof data.titulo === "string") {
      updates.titulo = data.titulo;
    }

    if (typeof data.descripcion === "string") {
      updates.descripcion = data.descripcion;
    }

    if (data.prioridad) {
      updates.prioridad = data.prioridad;
      if (data.prioridad === "alta") {
        updates.tecnico_asignado =
          data.tecnico_asignado ?? "técnico principal";
      } else if (data.tecnico_asignado !== undefined) {
        updates.tecnico_asignado = data.tecnico_asignado;
      }
    } else if (data.tecnico_asignado !== undefined) {
      updates.tecnico_asignado = data.tecnico_asignado;
    }

    if (data.estado) {
      updates.estado = data.estado;
      updates.fecha_cierre =
        data.estado === "cerrada" ? new Date() : null;
    }

    if (Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: "No hay datos para actualizar" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { matchedCount } = await incidencias.updateOne(
      { _id: objectId },
      { $set: updates },
    );

    if (matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Incidencia no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updated = await incidencias.findOne<IncidenciaDocument>({
      _id: objectId,
    });

    if (!updated) {
      return new Response(JSON.stringify({ error: "Incidencia no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(toIncidenciaDto(updated)), {
      headers: { "Content-Type": "application/json" },
    });
  },
};