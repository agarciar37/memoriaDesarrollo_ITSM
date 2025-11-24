// types.ts
export interface Incidencia {
  _id?: { $oid: string };
  titulo: string;
  descripcion: string;
  prioridad: "baja" | "media" | "alta";
  estado: "abierta" | "en curso" | "cerrada";
  tecnico?: string;
  fecha_creacion: Date;
  fecha_cierre?: Date | null;
}

export interface Dashboard {
  total: number;
  abiertas: number;
  enCurso: number;
  cerradas: number;
}

export interface Tarea {
  _id?: { $oid: string } | string;
  incidenciaId: string;       // 🏷 ID de la incidencia
  titulo: string;             // 📝 Nombre de la tarea
  descripcion?: string;       // 📄 Opcional
  completada: boolean;        // ✔️ Estado
  fecha_creacion: Date;       // 🕒
  fecha_completada?: Date;    // 🕒 cuando esté marcada
}
