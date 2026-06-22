/* ===========================================================================
   MOTOR GEOMÉTRICO DEL CUBO  (verificado: invariantes + todos los algoritmos)
   Sticker = { p:[x,y,z] del cubie, n:[..] normal de la cara, c: color }.
   Ejes: x=derecha(+)/izq(-), y=arriba(+)/abajo(-), z=frente(+)/atrás(-).
   Los movimientos son rotaciones de 90° por matriz → la "mano" sale correcta
   por geometría, sin ciclos de facelets memorizados.
   =========================================================================== */
export const COL = { "0,1,0": "Y", "0,-1,0": "W", "0,0,1": "G", "0,0,-1": "B", "1,0,0": "R", "-1,0,0": "O" };
export const keyN = (n) => n[0] + "," + n[1] + "," + n[2];

export function solved() {
  const stickers = [];
  const norms = [[0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0]];
  for (const n of norms) {
    const ax = n[0] !== 0 ? 0 : n[1] !== 0 ? 1 : 2;
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
      const p = [0, 0, 0]; p[ax] = n[ax];
      const others = [0, 1, 2].filter((i) => i !== ax);
      p[others[0]] = a; p[others[1]] = b;
      stickers.push({ p: p.slice(), n: n.slice(), c: COL[keyN(n)] });
    }
  }
  return stickers;
}

export function rot(v, axis, s) {
  const [x, y, z] = v;
  if (axis === "x") return s > 0 ? [x, -z, y] : [x, z, -y];
  if (axis === "y") return s > 0 ? [z, y, -x] : [-z, y, x];
  return s > 0 ? [-y, x, z] : [y, -x, z];
}

export const AXIS = { x: 0, y: 1, z: 2 };

export function layerMove(st, axis, coords, s) {
  const ai = AXIS[axis];
  for (const sk of st) if (coords.includes(sk.p[ai])) { sk.p = rot(sk.p, axis, s); sk.n = rot(sk.n, axis, s); }
}

export const FACE = {
  U: { axis: "y", coord: 1, sign: -1 }, D: { axis: "y", coord: -1, sign: 1 },
  R: { axis: "x", coord: 1, sign: -1 }, L: { axis: "x", coord: -1, sign: 1 },
  F: { axis: "z", coord: 1, sign: -1 }, B: { axis: "z", coord: -1, sign: 1 },
};
export const SLICE = { M: { axis: "x", coord: 0, sign: 1 }, E: { axis: "y", coord: 0, sign: 1 }, S: { axis: "z", coord: 0, sign: -1 } };
export const WIDE = {
  r: { axis: "x", coords: [1, 0], sign: -1 }, l: { axis: "x", coords: [-1, 0], sign: 1 },
  u: { axis: "y", coords: [1, 0], sign: -1 }, d: { axis: "y", coords: [-1, 0], sign: 1 },
  f: { axis: "z", coords: [1, 0], sign: -1 }, b: { axis: "z", coords: [-1, 0], sign: 1 },
};
export const ROT = { x: { axis: "x", sign: -1 }, y: { axis: "y", sign: -1 }, z: { axis: "z", sign: -1 } };

// Devuelve qué capa(s) rota un token, en qué sentido y cuántos cuartos de vuelta.
// { axis, coords, sign (ya combinado con el ' ), times }.
export function parseToken(tok) {
  const base = tok[0]; const rest = tok.slice(1);
  let times = 1, sgn = 1;
  if (rest.includes("2")) times = 2;
  if (rest.includes("'")) sgn = -1;
  let axis, coords, sign;
  if (FACE[base]) { axis = FACE[base].axis; coords = [FACE[base].coord]; sign = FACE[base].sign; }
  else if (SLICE[base]) { axis = SLICE[base].axis; coords = [SLICE[base].coord]; sign = SLICE[base].sign; }
  else if (WIDE[base]) { axis = WIDE[base].axis; coords = WIDE[base].coords; sign = WIDE[base].sign; }
  else if (ROT[base]) { axis = ROT[base].axis; coords = [-1, 0, 1]; sign = ROT[base].sign; }
  else throw new Error("bad token " + tok);
  return { axis, coords, sign: sign * sgn, times };
}

export function doToken(st, tok) {
  const { axis, coords, sign, times } = parseToken(tok);
  for (let t = 0; t < times; t++) layerMove(st, axis, coords, sign);
}

// Lista de tokens de un algoritmo (para animar paso a paso).
export function tokens(alg) {
  return alg.replace(/[()\[\]]/g, " ").trim().split(/\s+/).filter(Boolean).map((t) => t.replace("2'", "2").replace("'2", "2"));
}

export function applyAlg(st, alg) {
  const toks = alg.replace(/[()\[\]]/g, " ").trim().split(/\s+/).filter(Boolean);
  for (let tok of toks) { tok = tok.replace("2'", "2").replace("'2", "2"); doToken(st, tok); }
  return st;
}

export function invertAlg(alg) {
  const toks = alg.replace(/[()\[\]]/g, " ").trim().split(/\s+/).filter(Boolean).map((t) => t.replace("2'", "2").replace("'2", "2"));
  return toks.reverse().map((t) => {
    if (t.includes("2")) return t.replace(/2.*/, "2");
    if (t.includes("'")) return t.replace("'", "");
    return t + "'";
  }).join(" ");
}

export function uFaceColors(st) {
  const g = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const sk of st) if (sk.n[1] === 1 && sk.p[1] === 1) g[sk.p[2] + 1][sk.p[0] + 1] = sk.c;
  return g; // fila 0 = atrás (z=-1), columna 0 = izquierda (x=-1)
}

export function tabsOf(st) {
  const r = { back: [0, 0, 0], front: [0, 0, 0], left: [0, 0, 0], right: [0, 0, 0] };
  for (const sk of st) {
    if (sk.p[1] !== 1) continue;
    if (sk.n[2] === -1) r.back[sk.p[0] + 1] = sk.c;
    if (sk.n[2] === 1) r.front[sk.p[0] + 1] = sk.c;
    if (sk.n[0] === -1) r.left[sk.p[2] + 1] = sk.c;
    if (sk.n[0] === 1) r.right[sk.p[2] + 1] = sk.c;
  }
  return r;
}

export function llFromAlg(alg) {
  const st = solved();
  applyAlg(st, invertAlg(alg)); // pre-estado = aplicar el inverso al cubo resuelto
  return { u: uFaceColors(st), t: tabsOf(st) };
}

/* ---------------------------------------------------------------------------
   AMPLIACIÓN: lectura de una cara cualquiera, para el visor en perspectiva.
   Devuelve una matriz 3×3 de colores de la cara cuya normal es `normal`,
   orientada tal y como se ve mirando esa cara de frente.
   --------------------------------------------------------------------------- */
const FACE_NORMAL = {
  U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], R: [1, 0, 0], L: [-1, 0, 0],
};

// Para cada cara: cómo mapear (fila, columna) de la vista 2D a los ejes 3D.
// rowAxis/colAxis = índice de eje (0=x,1=y,2=z); rowDir/colDir = signo del recorrido.
// fila 0 = arriba de la vista, columna 0 = izquierda de la vista.  idx = pos*dir + 1.
const FACE_MAP = {
  U: { rowAxis: 2, rowDir: 1, colAxis: 0, colDir: 1 },   // planta: arriba=atrás(-z→fila0), der=+x  (igual que uFaceColors)
  D: { rowAxis: 2, rowDir: -1, colAxis: 0, colDir: 1 },  // base: arriba=frente(+z→fila0), der=+x
  F: { rowAxis: 1, rowDir: -1, colAxis: 0, colDir: 1 },  // frente: arriba=+y, der=+x
  B: { rowAxis: 1, rowDir: -1, colAxis: 0, colDir: -1 }, // atrás: arriba=+y, der=-x
  R: { rowAxis: 1, rowDir: -1, colAxis: 2, colDir: -1 }, // derecha: arriba=+y, der=-z (frente a la izquierda)
  L: { rowAxis: 1, rowDir: -1, colAxis: 2, colDir: 1 },  // izquierda: arriba=+y, der=+z
};

export function faceColors(st, face) {
  const n = FACE_NORMAL[face];
  const m = FACE_MAP[face];
  const g = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const sk of st) {
    if (sk.n[0] !== n[0] || sk.n[1] !== n[1] || sk.n[2] !== n[2]) continue;
    // recuperar fila/columna invirtiendo el mapa: pos = dir * (idx - 1)  →  idx = pos*dir + 1
    const r = sk.p[m.rowAxis] * m.rowDir + 1;
    const c = sk.p[m.colAxis] * m.colDir + 1;
    g[r][c] = sk.c;
  }
  return g;
}

// Estado del cubo tras aplicar una secuencia desde resuelto (copia, no muta).
export function stateAfter(alg) {
  const st = solved();
  if (alg) applyAlg(st, alg);
  return st;
}

// Las 6 caras como matrices 3×3, listas para pintar.
export function allFaces(st) {
  return {
    U: faceColors(st, "U"), D: faceColors(st, "D"), F: faceColors(st, "F"),
    B: faceColors(st, "B"), R: faceColors(st, "R"), L: faceColors(st, "L"),
  };
}
