// Test del motor del cubo. Ejecutar:  node scripts/engine.test.mjs
import { solved, applyAlg, invertAlg, faceColors, stateAfter } from "../src/lib/cubeEngine.js";

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.error("  ✗ FALLO:", msg); } };
const eqState = (a, b) =>
  a.length === b.length &&
  a.every((sk, i) => sk.c === b[i].c && sk.p.join() === b[i].p.join() && sk.n.join() === b[i].n.join());

// 1) Estructura del cubo resuelto: 54 stickers, 9 de cada color.
const S = solved();
ok(S.length === 54, "el cubo resuelto debe tener 54 stickers, tiene " + S.length);
const counts = {};
for (const sk of S) counts[sk.c] = (counts[sk.c] || 0) + 1;
ok(["Y", "W", "G", "B", "R", "O"].every((c) => counts[c] === 9), "9 stickers por color: " + JSON.stringify(counts));

// 2) Lector de caras del estado resuelto: cada cara, un solo color correcto.
const faceColor = { U: "Y", D: "W", F: "G", B: "B", R: "R", L: "O" };
for (const [f, col] of Object.entries(faceColor)) {
  const g = faceColors(S, f);
  const flat = g.flat();
  ok(flat.length === 9 && flat.every((c) => c === col), `cara ${f} resuelta debe ser toda ${col}: ${JSON.stringify(g)}`);
}

// 3) Cada algoritmo del contenido, aplicado y luego invertido, vuelve a resuelto.
const ALGS = [
  "F R U R' U' F'", "F U R U' R' F'", "f R U R' U' f'",
  "R U R' U R U2 R'", "R U2 R' U' R U' R'",
  "R' F R' B2 R F' R' B2 R2",
  "R U' R U R U R U' R' U' R2", "R2 U R U R' U' R' U' R' U R'",
  "U R U' L' U R' U' L", "R' D' R D",
  "R U R' U R U' R' U R U2 R'", "R U2 R2 U' R2 U' R2 U2 R",
  "R2 D R' U2 R D' R' U2 R'", "r U R' U' r' F R F'", "F' r U R' U' r' F R",
  "M2 U M2 U M' U2 M2 U2 M'", "M2 U M2 U2 M2 U M2",
  "x R' U R' D2 R U' R' D2 R2 x'", "x R2 D2 R U R' D2 R U' R x'",
  "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
  "R' U L' U2 R U' R' U2 R L", "R U R' F' R U R' U' R' F R2 U' R'",
  "R U R' U' R' F R2 U' R' U' R U R' F'",
  "R U' R' U' R U R D R' U' R D' R' U2 R'", "R' U2 R U2 R' F R U R' U' R' F' R2",
  "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
  "R2 U R' U R' U' R U' R2 D U' R' U R D'", "F' U' F R2 u R' U R U' R u' R2",
  "R2 U' R U' R U R' U R2 D' U R U' R' D", "D' R U R' U' D R2 U' R U' R' U R' U R2",
  "R' U R' U' y R' F' R2 U' R' U R' F R F y'",
  "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
  "R' U R U' R' F' U' F R U R' F R' F' R U' R",
];
for (const alg of ALGS) {
  const st = solved();
  applyAlg(st, alg);
  applyAlg(st, invertAlg(alg));
  ok(eqState(st, S), `alg·inv(alg) debe volver a resuelto: "${alg}"`);
}

// 4) Sexteto (R U R' U') tiene orden 6.
{
  const st = solved();
  for (let i = 0; i < 6; i++) applyAlg(st, "R U R' U'");
  ok(eqState(st, S), "(R U R' U')×6 debe volver a resuelto");
}

// 5) Movimientos cambian las caras esperadas (valida orientación del lector).
{
  const st = stateAfter("U");
  ok(faceColors(st, "U").flat().every((c) => c === "Y"), "tras U, la cara U sigue toda amarilla");
  ok(faceColors(st, "D").flat().every((c) => c === "W"), "tras U, la cara D sigue toda blanca");
  const ftop = faceColors(st, "F")[0];
  ok(ftop[0] === ftop[1] && ftop[1] === ftop[2] && ftop[0] !== "G", "tras U, la fila superior de F es sólida y ya no es verde: " + JSON.stringify(ftop));
}
{
  const st = stateAfter("R");
  const fcol = [0, 1, 2].map((r) => faceColors(st, "F")[r][2]);
  ok(fcol.every((c) => c === fcol[0] && (fcol[0] === "W" || fcol[0] === "Y")), "tras R, la columna derecha de F es sólida y blanca/amarilla: " + JSON.stringify(fcol));
}

console.log(`\nMotor del cubo: ${pass} comprobaciones OK, ${fail} fallos.`);
process.exit(fail ? 1 : 0);
