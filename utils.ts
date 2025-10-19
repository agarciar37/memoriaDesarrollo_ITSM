// utils/db.ts
import { MongoClient } from "npm:mongodb";
import "jsr:@std/dotenv/load"; // Carga automática del archivo .env

// 📦 URL de conexión a MongoDB Atlas
const uri = Deno.env.get("MONGO_URI");
const dbName = Deno.env.get("DB_NAME");

if (!uri || !dbName) {
  throw new Error("❌ Faltan variables de entorno MONGO_URI o DB_NAME en el archivo .env");
}

// 🚀 Crear cliente y conectar a MongoDB
const client = new MongoClient(uri);
await client.connect();

console.log("✅ Conectado a MongoDB Atlas correctamente");

export const db = client.db(dbName);
export const incidencias = db.collection("incidencias");
