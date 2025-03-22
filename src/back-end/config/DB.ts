import envConfig from "./env.config.ts";
import { neon } from "@neondatabase/serverless";
envConfig;
export const sql = neon(process.env.DATABASE_URL!);
