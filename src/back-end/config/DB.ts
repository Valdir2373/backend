import envConfig from "./env.config";
import { neon } from "@neondatabase/serverless";
envConfig;
export const sql = neon(process.env.DATABASE_URL!);
