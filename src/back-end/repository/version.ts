import { sql } from "../config/DB.js";
export default async function getDatabaseVersion(): Promise<string> {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    return version;
  } catch (error) {
    console.error("Erro ao obter versão:", error);
    throw error; // Re-lança o erro para ser tratado na camada superior
  }
}
