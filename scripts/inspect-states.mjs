// ¿Todo caso de POSICIÓN de esquinas se resuelve con el 3-ciclo (eligiendo bien)? BFS.
import { solved, applyAlg, stateAfter, doToken } from "../src/lib/cubeEngine.js";

const A = "U R U' L' U R' U' L";
const clone = (st) => st.map((s) => ({ c: s.c, p: s.p.slice(), n: s.n.slice() }));
const centerColor = (st, ax, sign) => { const p = [0, 0, 0]; p[ax] = sign; return st.find((s) => s.p.join() === p.join() && s.n[ax] === sign).c; };
const cornerColors = (st, x, z) => st.filter((s) => s.p[0] === x && s.p[1] === 1 && s.p[2] === z).map((s) => s.c).sort().join("");
function inPlace(st, x, z) {
  const want = [centerColor(st, 1, 1), centerColor(st, 0, x), centerColor(st, 2, z)].sort().join("");
  return cornerColors(st, x, z) === want;
}
const CORN = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
const allInPlace = (st) => CORN.every(([x, z]) => inPlace(st, x, z));
function solvableByU(st0) { for (let k = 0; k < 4; k++) { const st = clone(st0); for (let i = 0; i < k; i++) doToken(st, "U"); if (allInPlace(st)) return true; } return false; }
const countInPlace = (st) => CORN.filter(([x, z]) => inPlace(st, x, z)).length;

// clave del estado = posición+identidad de las 4 esquinas (lo único que importa)
const key = (st) => CORN.map(([x, z]) => cornerColors(st, x, z)).join("|");

// BFS: en cada paso el solucionador puede girar el cubo (y^k) y aplicar A.
function bfs(st0) {
  if (solvableByU(st0)) return 0;
  const seen = new Set([key(st0)]);
  let frontier = [st0];
  for (let depth = 1; depth <= 6; depth++) {
    const next = [];
    for (const st of frontier) {
      for (let k = 0; k < 4; k++) {
        const s = clone(st);
        for (let i = 0; i < k; i++) doToken(s, "y");
        applyAlg(s, A);
        if (solvableByU(s)) return depth;
        const kk = key(s);
        if (!seen.has(kk)) { seen.add(kk); next.push(s); }
      }
    }
    frontier = next;
  }
  return -1;
}

const CASES = {
  "Aa · 3-ciclo": "x R' U R' D2 R U' R' D2 R2 x'",
  "T · 2 adyacentes a intercambiar": "R U R' U' R' F R2 U' R' U' R U R' F'",
  "Ja · 2 adyacentes a intercambiar": "R' U L' U2 R U' R' U2 R L",
  "Y · 2 diagonales a intercambiar": "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  "E · doble diagonal": "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
  "Na · doble intercambio": "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
  "V · diagonal": "R' U R' U' y R' F' R2 U' R' U R' F R F y'",
};
console.log("Aplicaciones MÍNIMAS del 3-ciclo para colocar esquinas (eligiendo bien):\n");
for (const [name, alg] of Object.entries(CASES)) {
  const st = stateAfter(alg);
  console.log(`  ${name.padEnd(34)} bien=${countInPlace(st)}  →  ${bfs(st)} aplicaciones`);
}
