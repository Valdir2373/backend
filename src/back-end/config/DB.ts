import envConfig from "./env.config.js";
import { neon } from "@neondatabase/serverless";
envConfig;
export const sql = neon(process.env.DATABASE_URL!);
