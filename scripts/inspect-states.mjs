// Inspecciona y verifica los estados de los diagramas. Ejecutar: node scripts/inspect-states.mjs
import { stateAfter, faceColors, invertAlg } from "../src/lib/cubeEngine.js";

const grid = (st, f) => faceColors(st, f).map((r) => r.join("")).join("/");
const show = (label, alg) => {
  const st = stateAfter(alg);
  console.log(`\n== ${label}   [${alg || "resuelto"}]`);
  console.log("  U:", grid(st, "U"), " F:", grid(st, "F"), " R:", grid(st, "R"));
};
const cell = (alg, f, r, c) => faceColors(stateAfter(alg), f)[r][c];
let ok = 0, bad = 0;
const expect = (alg, f, r, c, val) => {
  const got = cell(alg, f, r, c);
  if (got === val) ok++; else { bad++; console.log(`  ✗ ${alg} ${f}[${r}][${c}] = ${got}, esperaba ${val}`); }
};

console.log("######## CAPA 1 · MARGARITA (amarillo arriba) ########");
const MARG = "F2 R2 B2 L2";
show("Margarita", MARG);
// centro amarillo + 4 pétalos blancos + pétalo frontal verde casando con centro
expect(MARG, "U", 1, 1, "Y");           // centro arriba amarillo
expect(MARG, "U", 0, 1, "W");           // pétalo atrás
expect(MARG, "U", 1, 0, "W");           // pétalo izquierda
expect(MARG, "U", 1, 2, "W");           // pétalo derecha
expect(MARG, "U", 2, 1, "W");           // pétalo frente
expect(MARG, "F", 1, 1, "G");           // centro frontal verde
expect(MARG, "F", 0, 1, "G");           // cara frontal del pétalo frente = verde (alineado)

show("Bajar pétalo frontal · DESPUÉS (F2)", "F2 R2 B2 L2 F2");
// tras bajar, la arista blanco-verde queda abajo-frente: F[2][1] = verde casando
expect("F2 R2 B2 L2 F2", "F", 2, 1, "G");
expect("F2 R2 B2 L2 F2", "U", 2, 1, "Y"); // arriba-frente vuelve a amarillo

console.log("\n######## CAPA 1 · ESQUINAS (amarillo arriba, cruz hecha) ########");
// Estado con la cruz blanca hecha y una esquina blanca arriba, sobre su hueco frontal-derecho.
// Lo genero sacando la esquina blanco-verde-rojo a la capa de arriba con el inverso de su inserción.
for (const alg of ["R U R' U'", "R U' R'", "F' U' F", "F' U F", "R U2 R'"]) {
  show("esquina sacada", alg);
}
// Inserción de esquina por la derecha: estado caso = inverso
const INS = "U R U' R'"; // mete la esquina frontal-derecha cuando el blanco mira a la derecha
show("Esquina · estado caso (a reconocer)", invertAlg(INS));
console.log("  cara D (primera capa) toda blanca:", faceColors(stateAfter(invertAlg(INS)), "D").flat().every((c) => c === "W"));

console.log("\n######## CAPA 1 · objetivo (primera capa hecha, resto pendiente) ########");
show("Primera capa hecha", invertAlg("R U R' U R U2 R'"));
console.log("  D toda blanca:", faceColors(stateAfter(invertAlg("R U R' U R U2 R'")), "D").flat().every((c) => c === "W"));

console.log(`\nComprobaciones: ${ok} OK, ${bad} fallos.`);
