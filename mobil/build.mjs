// Telefon sürümünü ../docs klasörüne derler (GitHub Pages bu klasörü yayınlar).
import { build } from "esbuild";
import { copyFileSync, mkdirSync } from "node:fs";

const HEDEF = "../docs";
mkdirSync(HEDEF, { recursive: true });

await build({
  entryPoints: ["src/app.js"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  outfile: `${HEDEF}/app.bundle.js`,
});

for (const dosya of ["index.html", "stil.css", "manifest.webmanifest", "sw.js"]) {
  copyFileSync(`src/${dosya}`, `${HEDEF}/${dosya}`);
}
copyFileSync("node_modules/sql.js/dist/sql-wasm.js", `${HEDEF}/sql-wasm.js`);
copyFileSync("node_modules/sql.js/dist/sql-wasm.wasm", `${HEDEF}/sql-wasm.wasm`);
console.log("Derlendi ->", HEDEF);
