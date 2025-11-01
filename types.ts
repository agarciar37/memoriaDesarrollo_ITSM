// types.ts
export interface Incidencia {
  _id?: { $oid: string };
  titulo: string;
  descripcion: string;
  prioridad: "baja" | "media" | "alta";
  estado: "abierta" | "en curso" | "cerrada";
  tecnico?: string;
  fecha_creacion: Date;
  fecha_cierre?: Date;
}
