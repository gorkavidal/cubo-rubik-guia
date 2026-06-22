// Verifica el método INFALIBLE "orientar de una en una" (sin reconocer casos).
import { solved, applyAlg, invertAlg } from "../src/lib/cubeEngine.js";

const clone = (st) => st.map((s) => ({ c: s.c, p: s.p.slice(), n: s.n.slice() }));
const stk = (st, x, y, z, n) => st.find((s) => s.p[0] === x && s.p[1] === y && s.p[2] === z && s.n[0] === n[0] && s.n[1] === n[1] && s.n[2] === n[2]);
const orientedAt = (st, x, z) => stk(st, x, 1, z, [0, 1, 0]).c === "Y";
const CORN = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
const allOriented = (st) => CORN.every(([x, z]) => orientedAt(st, x, z));
const fullySolved = (st) => { const r = solved(); return st.every((s, i) => s.c === r.c && s.p.join() === r.p.join() && s.n.join() === r.n.join()); };

const OLLC = {
  Sune: "R U R' U R U2 R'", Antisune: "R U2 R' U' R U' R'",
  H: "R U R' U R U' R' U R U2 R'", Pi: "R U2 R2 U' R2 U' R2 U2 R",
  T: "r U R' U' r' F R F'", U_hl: "R2 D R' U2 R D' R' U2 R'", L_bt: "F' r U R' U' r' F R",
};

// Método: por cada esquina sin amarillo arriba, ponla en FUR (girando U) y repite
// R' D' R D hasta que muestre amarillo arriba. Al final, U para realinear.
function orientOneByOne(st0) {
  let st = clone(st0); let trick = 0, uTurns = 0;
  for (let guard = 0; guard < 30; guard++) {
    if (allOriented(st)) break;
    // trae una esquina NO orientada a FUR
    let spins = 0;
    while (orientedAt(st, 1, 1) && spins < 4) { applyAlg(st, "U"); uTurns++; spins++; }
    // repite el truco hasta orientar esa esquina (sin tocar U)
    let reps = 0;
    while (!orientedAt(st, 1, 1) && reps < 6) { applyAlg(st, "R' D' R D"); trick++; reps++; }
  }
  return { oriented: allOriented(st), tricks: trick };
}

console.log("Método 'de una en una' (R' D' R D), por caso:");
let allOk = true;
for (const [n, a] of Object.entries(OLLC)) {
  const st = solved(); applyAlg(st, invertAlg(a));
  const r = orientOneByOne(st);
  if (!r.oriented) allOk = false;
  console.log(`  ${n.padEnd(12)} -> ${r.oriented ? "TODAS amarillas ✓" : "FALLA ✗"}  (${r.tricks} repeticiones del truco)`);
}
console.log("\n¿Funciona para TODOS los casos?", allOk ? "SÍ ✓" : "no");

// Comprobación de que 2 y 4 repeticiones giran la esquina 120/240 (sin tocar U)
const st = solved();
console.log("\nUna esquina de la cara amarilla, repitiendo R' D' R D (debe volver a su sitio cada 6):");
let s2 = solved(); for (let i = 1; i <= 6; i++) { applyAlg(s2, "R' D' R D"); if (fullySolved(s2)) console.log("  vuelve a resuelto tras", i, "repeticiones"); }
