import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number.parseInt(process.env.PORT || "5173", 10);
const host = "0.0.0.0";

const distDir = path.join(__dirname, "dist");
const serve = sirv(distDir, { single: true, etag: true, gzip: true });

const server = http.createServer((req, res) => {
  serve(req, res);
});

server.listen(port, host, () => {
  console.log(`Cineflow Site running on http://${host}:${port}`);
});

