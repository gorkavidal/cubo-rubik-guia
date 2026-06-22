/* ===========================================================================
   PROYECCIÓN ISOMÉTRICA del cubo (funciones puras, testables).
   Ejes del cubo, en coordenadas de pantalla (x→derecha, y→abajo):
     +x (derecha del cubo) → derecha y abajo
     +y (arriba del cubo)  → arriba
     +z (frente del cubo)  → izquierda y abajo
   Vemos 3 caras: U (arriba), F (frente), R (derecha).
   =========================================================================== */
export const ISO = {
  ex: [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)],   // +x
  ey: [0, -1],                                           // +y
  ez: [-Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)],   // +z
};
export const UNIT = 30; // tamaño interno de celda; el SVG se escala con `size`

export function project([x, y, z]) {
  return [
    (x * ISO.ex[0] + y * ISO.ey[0] + z * ISO.ez[0]) * UNIT,
    (x * ISO.ex[1] + y * ISO.ey[1] + z * ISO.ez[1]) * UNIT,
  ];
}

// Centro 3D de la celda (r,c) de cada cara visible. Coherente con FACE_MAP del motor.
export function cellCenter(face, r, c) {
  if (face === "U") return [c - 1, 1.5, r - 1];   // fila→z, col→x
  if (face === "F") return [c - 1, 1 - r, 1.5];   // fila→-y, col→x
  if (face === "R") return [1.5, 1 - r, 1 - c];   // fila→-y, col→-z
  return [0, 0, 0];
}

// Los dos semiejes (longitud 0.5) que forman cada celda en su cara.
export function cellAxes(face) {
  if (face === "U") return [[0.5, 0, 0], [0, 0, 0.5]];
  if (face === "F") return [[0.5, 0, 0], [0, -0.5, 0]];
  if (face === "R") return [[0, 0, -0.5], [0, -0.5, 0]];
  return [[0, 0, 0], [0, 0, 0]];
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

// Cuatro esquinas 2D de la celda (r,c), con separación `inset` (1 = sin hueco).
export function cellCorners2d(face, r, c, inset = 0.86) {
  const center = cellCenter(face, r, c);
  const [axU, axV] = cellAxes(face);
  const hu = scale(axU, inset), hv = scale(axV, inset);
  return [
    add(add(center, hu), hv), add(sub(center, hu), hv),
    sub(sub(center, hu), hv), sub(add(center, hu), hv),
  ].map(project);
}

// Bounding box de las 9×3 celdas visibles, para fijar el viewBox.
export function visibleBBox(inset = 0.86) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const face of ["U", "F", "R"]) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      for (const [x, y] of cellCorners2d(face, r, c, inset)) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}
