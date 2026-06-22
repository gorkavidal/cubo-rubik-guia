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

/* ---------------------------------------------------------------------------
   ANIMACIÓN: geometría por sticker desde (p, n) y rotación por ángulo libre.
   --------------------------------------------------------------------------- */

// Rotación 3D por ángulo t (rad) alrededor de un eje. Coincide con el motor:
// a t = sign·90° reproduce exactamente rot(v, axis, sign).
export function rotateAngle([x, y, z], axis, t) {
  const c = Math.cos(t), s = Math.sin(t);
  if (axis === "x") return [x, y * c - z * s, y * s + z * c];
  if (axis === "y") return [x * c + z * s, y, -x * s + z * c];
  return [x * c - y * s, x * s + y * c, z];
}

const axisIndex = (n) => (n[0] !== 0 ? 0 : n[1] !== 0 ? 1 : 2);

// Centro 3D del sticker: el cubie p, llevado a la superficie del cubo (±1.5) en su normal.
export function stickerCenter3d(p, n) {
  const c = [p[0], p[1], p[2]];
  const ax = axisIndex(n);
  c[ax] = 1.5 * n[ax];
  return c;
}

// Cuatro esquinas 3D del sticker (en el plano de su cara), con separación `inset`.
export function stickerCorners3d(p, n, inset = 0.86) {
  const center = stickerCenter3d(p, n);
  const ax = axisIndex(n);
  const e = [];
  for (let i = 0; i < 3; i++) if (i !== ax) { const v = [0, 0, 0]; v[i] = 0.5 * inset; e.push(v); }
  const [a, b] = e;
  return [
    [center[0] + a[0] + b[0], center[1] + a[1] + b[1], center[2] + a[2] + b[2]],
    [center[0] - a[0] + b[0], center[1] - a[1] + b[1], center[2] - a[2] + b[2]],
    [center[0] - a[0] - b[0], center[1] - a[1] - b[1], center[2] - a[2] - b[2]],
    [center[0] + a[0] - b[0], center[1] + a[1] - b[1], center[2] + a[2] - b[2]],
  ];
}

// Visible si la cara mira hacia la cámara isométrica (dirección +x+y+z).
export function isVisible(n) {
  return n[0] + n[1] + n[2] > 0.0001;
}

// Profundidad hacia la cámara (mayor = más cerca; se pinta encima).
export function depth(c) {
  return c[0] + c[1] + c[2];
}

// viewBox fijo que contiene el cubo entero (8 esquinas) con margen — estable durante la animación.
export function fullCubeBBox(margin = 16) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const x of [-1.5, 1.5]) for (const y of [-1.5, 1.5]) for (const z of [-1.5, 1.5]) {
    const [px, py] = project([x, y, z]);
    if (px < minX) minX = px; if (px > maxX) maxX = px;
    if (py < minY) minY = py; if (py > maxY) maxY = py;
  }
  return { x: minX - margin, y: minY - margin, w: maxX - minX + margin * 2, h: maxY - minY + margin * 2 };
}
