// utils/db.ts
import { MongoClient } from "npm:mongodb";
import "jsr:@std/dotenv/load";

const uri = Deno.env.get("MONGO_URL");
const dbName = Deno.env.get("DB_NAME");

if (!uri || !dbName) {
  throw new Error("❌ Faltan variables de entorno MONGO_URL o DB_NAME");
}

const client = new MongoClient(uri);
await client.connect();

console.log("✅ Conectado a MongoDB Atlas correctamente");

export const db = client.db(dbName);

export const incidencias = db.collection("incidencias");
export const tareas = db.collection("tareas");
export const audit_log = db.collection("audit_log");
