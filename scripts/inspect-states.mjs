// Analiza el comportamiento real de los gestos para poder ENSEÑARLOS con precisión.
// Ejecutar: node scripts/inspect-states.mjs
import { solved, applyAlg, stateAfter, faceColors, invertAlg } from "../src/lib/cubeEngine.js";

const grid = (st, f) => faceColors(st, f).map((r) => r.join("")).join("/");
const show = (label, alg) => {
  const st = stateAfter(alg);
  console.log(`\n== ${label}  [${alg || "resuelto"}]`);
  console.log("   U:", grid(st, "U"), " F:", grid(st, "F"), " R:", grid(st, "R"), " D:", grid(st, "D"));
};
const eq = (a, b) => a.every((sk, i) => sk.c === b[i].c && sk.p.join() === b[i].p.join() && sk.n.join() === b[i].n.join());
const solves = (caseAlg, gesto) => { const st = stateAfter(caseAlg); applyAlg(st, gesto); return eq(st, solved()); };

console.log("######## ESQUINA blanco-verde-rojo en U-F-R, según a dónde mira el BLANCO ########");
// Genero las 3 orientaciones partiendo de resuelto (la esquina vive en D-F-R) y subiéndola.
// Caso = inverso del gesto que la inserta. Pruebo gestos cortos y veo cuál resuelve cada uno.
const gestos = ["R U R'", "R U' R'", "F' U' F", "F' U F", "U R U' R'", "U' F' U F", "R U2 R'", "R U R' U'", "R U R' U' R U R'"];
for (const g of ["R U' R'", "F' U F", "R U2 R'"]) {
  const st = stateAfter(g);
  const wF = faceColors(st, "F")[0][2], wR = faceColors(st, "R")[0][0], wU = faceColors(st, "U")[2][2];
  console.log(`\n-- caso [${g}]  esquina U-F-R → U:${wU} F:${wF} R:${wR}  (¿dónde mira el blanco?)`);
  for (const ges of gestos) if (solves(g, ges)) console.log(`     se RESUELVE con:  ${ges}`);
}

console.log("\n\n######## ARISTA blanca atrapada en la FRANJA DEL MEDIO ########");
// La saco de su sitio (abajo) a la franja media para mostrar el caso.
for (const a of ["F' U' R U", "R U' R'", "F U F'", "L' U L U"]) {
  const st = stateAfter(a);
  const F = faceColors(st, "F"), R = faceColors(st, "R");
  const med = [];
  if (F[1][0] === "W") med.push("F:1,0"); if (F[1][2] === "W") med.push("F:1,2");
  if (R[1][0] === "W") med.push("R:1,0"); if (R[1][2] === "W") med.push("R:1,2");
  show(`arista; blanco en franja media: ${med.join(" ") || "(no)"}`, a);
}

console.log("\n######## ARISTA blanca mal ORIENTADA en su sitio (blanco al lado) ########");
// Cruz hecha pero una arista volteada: blanco mirando al frente en vez de abajo.
show("ejemplo volteada", "F U' R U");

console.log("\n######## Comprobación: la margarita y el bajar pétalo (ya en uso) ########");
show("margarita", "F2 R2 B2 L2");
show("tras bajar el pétalo de delante", "F2 R2 B2 L2 F2");
