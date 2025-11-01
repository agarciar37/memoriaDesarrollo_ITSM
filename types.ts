export type Prioridad = "alta" | "media" | "baja";
export type EstadoIncidencia = "abierta" | "en progreso" | "cerrada";

export interface Incidencia {
  _id: string;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: EstadoIncidencia;
  fecha_creacion: string;
  fecha_cierre?: string | null;
  tecnico_asignado?: string;
}