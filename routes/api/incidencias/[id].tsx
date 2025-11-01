import { Handlers } from "$fresh/server.ts";
import { ObjectId } from "npm:mongodb";
import { incidencias } from "../../../utils.ts";

export const handler: Handlers = {
  async DELETE(_req, ctx) {
    const { id } = ctx.params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Identificador no proporcionado" }), {
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

    const { deletedCount } = await incidencias.deleteOne({ _id: objectId });

    if (deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Incidencia no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, { status: 204 });
  },
};