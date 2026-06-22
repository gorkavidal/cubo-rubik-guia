// Inspecciona los estados que mostrarán los diagramas de capas 1 y 2.
// Ejecutar:  node scripts/inspect-states.mjs
import { stateAfter, faceColors, invertAlg, solved, applyAlg } from "../src/lib/cubeEngine.js";

const show = (label, alg) => {
  const st = stateAfter(alg);
  const U = faceColors(st, "U"), F = faceColors(st, "F"), R = faceColors(st, "R"), D = faceColors(st, "D");
  console.log("\n==== " + label + "   (alg = " + (alg || "resuelto") + ")");
  console.log("U:", U.map((r) => r.join("")).join(" / "));
  console.log("F:", F.map((r) => r.join("")).join(" / "));
  console.log("R:", R.map((r) => r.join("")).join(" / "));
  console.log("D:", D.map((r) => r.join("")).join(" / "), "  (toda W =", D.flat().every((c) => c === "W"), ")");
};

// ---- CAPA 2: aristas del medio (amarillo arriba, blanco abajo) ----
const AR = "U R U' R' U' F' U F";   // insertar a la DERECHA
const AL = "U' L' U L U F U' F'";   // insertar a la IZQUIERDA
console.log("\n######## CAPA 2 ########");
show("Inserción DERECHA · estado caso (a reconocer)", invertAlg(AR));
show("Inserción IZQUIERDA · estado caso", invertAlg(AL));

// ¿El algoritmo respeta la primera capa? El estado-caso debe tener D toda blanca.
const okD = (alg) => stateAfter(invertAlg(alg)) && faceColors(stateAfter(invertAlg(alg)), "D").flat().every((c) => c === "W");
console.log("\nDERECHA respeta primera capa (D toda blanca en el caso):", okD(AR));
console.log("IZQUIERDA respeta primera capa:", okD(AL));

// Y al aplicar el algoritmo desde el caso, debe quedar resuelto (arista insertada).
const solvesFromCase = (alg) => {
  const st = stateAfter(invertAlg(alg));
  applyAlg(st, alg);
  const ref = solved();
  return st.every((sk, i) => sk.c === ref[i].c && sk.p.join() === ref[i].p.join() && sk.n.join() === ref[i].n.join());
};
console.log("DERECHA inserta y resuelve:", solvesFromCase(AR));
console.log("IZQUIERDA inserta y resuelve:", solvesFromCase(AL));

// ---- CAPA 1: cruz y esquinas blancas (BLANCO ARRIBA con x2) ----
console.log("\n######## CAPA 1 (blanco arriba) ########");
show("Base resuelta blanco arriba (objetivo capa 1)", "x2");

// Candidatos para 'arista blanca a colocar' — busco una arista blanca visible en F o R.
console.log("\n-- candidatos arista blanca (blanco visible en F o R) --");
for (const a of ["x2 F'", "x2 F", "x2 R'", "x2 R", "x2 R U' R'", "x2 F U F'", "x2 D R' D'"]) {
  const st = stateAfter(a);
  const F = faceColors(st, "F"), R = faceColors(st, "R");
  const whitesF = [], whitesR = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    if (F[r][c] === "W") whitesF.push(`F:${r},${c}`);
    if (R[r][c] === "W") whitesR.push(`R:${r},${c}`);
  }
  console.log(a.padEnd(12), "blancos →", [...whitesF, ...whitesR].join(" ") || "(ninguno visible)");
}

// Candidatos para 'esquina blanca a encajar' con el truco R U R' U'.
console.log("\n-- candidatos esquina blanca --");
show("Esquina sacada a la base (x2 R U R')", "x2 R U R'");
show("Objetivo capa 2 · F2L + cruz amarilla pendiente", invertAlg("R U R' U R U2 R'"));
