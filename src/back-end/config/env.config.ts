import dotenv from "dotenv";
import path from "path";

const __filename = new URL(import.meta.url).pathname;

let __dirname = path.dirname(__filename);
if (__dirname.startsWith("/")) {
  __dirname = __dirname.slice(1).replaceAll("/", "\\");
}
const envPath = path.resolve(__dirname, "../.env");
export default dotenv.config({ path: envPath });
