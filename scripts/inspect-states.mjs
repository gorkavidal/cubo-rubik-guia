// Caso "blanco arriba" CORRECTO y prueba del método del usuario.
import { solved, applyAlg, stateAfter, faceColors } from "../src/lib/cubeEngine.js";

const S0 = solved();
const ufr = (st) => `U:${faceColors(st, "U")[2][2]} F:${faceColors(st, "F")[0][2]} R:${faceColors(st, "R")[0][0]}`;
const eq = (st) => st.every((sk, i) => sk.c === S0[i].c && sk.p.join() === S0[i].p.join() && sk.n.join() === S0[i].n.join());

// Un sticker "puede diferir" si su cubie actual NO está en la primera capa (y>=0),
// o si es el hueco de la esquina D-F-R (1,-1,1). Así exijo primera capa intacta salvo esa esquina.
function firstLayerIntactExceptDFR(st) {
  for (let i = 0; i < st.length; i++) {
    const sk = st[i], r = S0[i];
    const same = sk.c === r.c && sk.p.join() === r.p.join() && sk.n.join() === r.n.join();
    if (same) continue;
    const p = sk.p;
    const allowed = p[1] >= 0 || (p[0] === 1 && p[1] === -1 && p[2] === 1);
    if (!allowed) return false;
  }
  return true;
}

// Busca el caso blanco-arriba más corto (la esquina blanco-verde-rojo en U-F-R, blanco arriba).
const M = ["R", "R'", "U", "U'", "F", "F'", "L", "L'", "B", "B'", "D", "D'", "R2", "U2", "F2"];
let CASE = null;
const rec = (seq) => {
  if (CASE) return;
  if (seq.length) {
    const st = stateAfter(seq.join(" "));
    const U = faceColors(st, "U"), F = faceColors(st, "F"), R = faceColors(st, "R");
    const isWVR = (F[0][2] === "G" && R[0][0] === "R") || (F[0][2] === "R" && R[0][0] === "G");
    if (U[2][2] === "W" && isWVR && firstLayerIntactExceptDFR(st)) { CASE = seq.join(" "); return; }
  }
  if (seq.length >= 7) return;
  for (const m of M) { if (seq.length && m[0] === seq[seq.length - 1][0]) continue; rec([...seq, m]); }
};
rec([]);
console.log("CASO blanco-arriba (1ª capa intacta salvo D-F-R):", CASE, "->", CASE && ufr(stateAfter(CASE)));

if (CASE) {
  const test = (label, alg) => { console.log(`  ${label}: "${alg}"  ->  ${eq(stateAfter(CASE + " " + alg)) ? "RESUELVE ✓" : "no"}  (${ufr(stateAfter(CASE + " " + alg))})`); };
  console.log("\nTras solo R U' R' (¿a dónde va el blanco?):", ufr(stateAfter(CASE + " R U' R'")));
  console.log("\nProbando interpretaciones del método 'R U' R' ... R U R'':");
  for (const k of ["", "U", "U'", "U2"]) test(`R U' R' [${k || "·"}] R U R'`, `R U' R' ${k} R U R'`.replace(/\s+/g, " ").trim());
  console.log("\nOtras de 2 pasos (tumbar + insertar):");
  for (const a of ["R U2 R' U' R U R'", "R U' R' U' R U R'", "R U' R' U2 R U R'", "F' U' F U' R U R'"]) test("alg", a);
}
