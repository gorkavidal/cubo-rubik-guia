// Test de la proyección isométrica. Ejecutar:  node scripts/iso.test.mjs
import { project, cellCenter, cellCorners2d, visibleBBox } from "../src/lib/isoProjection.js";

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) pass++; else { fail++; console.error("  ✗ FALLO:", msg); } };
const cx = (face, r, c) => project(cellCenter(face, r, c));

// El centro del cubo proyecta al origen.
{ const [x, y] = project([0, 0, 0]); ok(Math.abs(x) < 1e-9 && Math.abs(y) < 1e-9, "centro del cubo en el origen"); }

// Las 3 caras caen donde se espera: top arriba, frente abajo-izquierda, derecha abajo-derecha.
{ const [, y] = cx("U", 1, 1); ok(y < -30, "centro de U claramente por encima del origen: y=" + y.toFixed(1)); }
{ const [x, y] = cx("F", 1, 1); ok(x < -20 && y > 10, "centro de F abajo-izquierda"); }
{ const [x, y] = cx("R", 1, 1); ok(x > 20 && y > 10, "centro de R abajo-derecha"); }

// Dentro del top: fila 0 (atrás) por encima de fila 2 (frente); col 0 (izq) a la izquierda de col 2 (der).
ok(cx("U", 0, 1)[1] < cx("U", 2, 1)[1], "U: fila 0 (atrás) por encima de fila 2 (frente)");
ok(cx("U", 1, 0)[0] < cx("U", 1, 2)[0], "U: col 0 (izquierda) a la izquierda de col 2 (derecha)");

// Las 3 caras se tocan en la esquina común del cubo [1.5,1.5,1.5]
// (arriba-frente-derecha): ese vértice debe ser una de las esquinas de la
// celda de esquina de cada cara. Confirma que U/F/R encajan sin solapar.
const corner = project([1.5, 1.5, 1.5]);
const hasCorner = (face, r, c) =>
  cellCorners2d(face, r, c, 1).some((p) => Math.abs(p[0] - corner[0]) < 1e-6 && Math.abs(p[1] - corner[1]) < 1e-6);
ok(hasCorner("U", 2, 2), "U[2][2] toca la esquina común arriba-frente-derecha");
ok(hasCorner("F", 0, 2), "F[0][2] toca la esquina común arriba-frente-derecha");
ok(hasCorner("R", 0, 0), "R[0][0] toca la esquina común arriba-frente-derecha");

// El bounding box es simétrico en x respecto al origen (cubo centrado).
{ const bb = visibleBBox(); ok(Math.abs(bb.minX + bb.maxX) < 1e-6, "bbox simétrico en x: " + bb.minX.toFixed(1) + " / " + bb.maxX.toFixed(1)); }

console.log(`\nProyección isométrica: ${pass} comprobaciones OK, ${fail} fallos.`);
process.exit(fail ? 1 : 0);
