import React, { useMemo } from "react";
import { stateAfter, faceColors } from "../lib/cubeEngine.js";
import { project, cellCenter, cellCorners2d, visibleBBox } from "../lib/isoProjection.js";
import { T } from "../lib/theme.js";

/* ===========================================================================
   VISOR DE CUBO EN PERSPECTIVA ISOMÉTRICA  (3 caras: arriba, frente, derecha)
   Alimentado por el motor: el estado se obtiene aplicando `alg` al cubo resuelto.
   La geometría usa las MISMAS coordenadas que faceColors → correcto por
   construcción. Pensado para enseñar las capas 1 y 2 (y ver el cubo entero).

   Props:
     alg        string   — secuencia aplicada desde el cubo resuelto (define el estado)
     state      []        — alternativamente, un estado de stickers ya calculado
     size       number    — lado del SVG en px (por defecto 200)
     highlight  string[]  — celdas a resaltar, formato "U:r,c" / "F:r,c" / "R:r,c"
     dim        bool       — atenúa lo no resaltado para enfocar la pieza
     arrows     {from,to,color?}[] — flechas entre centros de celda ("F:r,c")
     labels     bool       — rotula ARRIBA / FRENTE / DERECHA
   =========================================================================== */

const FACE_SHADE = { U: 1.0, F: 0.93, R: 0.85 }; // leve sombreado de volumen, sin apagar los colores (p.ej. el blanco)
const INSET = 0.86;

// Oscurece un color hex mezclándolo con negro (factor 1 = igual, 0.8 = 20% más oscuro).
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const ptsAttr = (pts) => pts.map((q) => q[0].toFixed(2) + "," + q[1].toFixed(2)).join(" ");

export default function CubeView({
  alg = "", state = null, size = 200, highlight = [], dim = false, arrows = [], labels = false,
}) {
  const faces = useMemo(() => {
    const st = state || stateAfter(alg);
    return { U: faceColors(st, "U"), F: faceColors(st, "F"), R: faceColors(st, "R") };
  }, [alg, state]);

  const hi = useMemo(() => new Set(highlight), [highlight]);

  const polys = [];
  for (const face of ["U", "F", "R"]) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const key = `${face}:${r},${c}`;
      const pts = cellCorners2d(face, r, c, INSET);
      const isHi = hi.has(key);
      const fill = shade(T[faces[face][r][c]] || T.tabDark, FACE_SHADE[face]);
      const opacity = dim && !isHi ? 0.42 : 1;
      polys.push({ key, pts, fill, isHi, opacity });
    }
  }

  const cell2d = (spec) => {
    const [face, rc] = spec.split(":");
    const [r, c] = rc.split(",").map(Number);
    return project(cellCenter(face, r, c));
  };
  const arrowEls = arrows.map((a, i) => ({ p0: cell2d(a.from), p1: cell2d(a.to), color: a.color || T.hl, i }));

  // viewBox a partir del bounding box real (+ flechas + padding para rótulos).
  const bb = visibleBBox(INSET);
  let { minX, minY, maxX, maxY } = bb;
  for (const a of arrowEls) for (const p of [a.p0, a.p1]) {
    if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
    if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
  }
  const pad = labels ? 30 : 13;
  const vb = `${(minX - pad).toFixed(1)} ${(minY - pad).toFixed(1)} ${(maxX - minX + pad * 2).toFixed(1)} ${(maxY - minY + pad * 2).toFixed(1)}`;

  const labelEls = labels ? [
    { t: "ARRIBA", at: project([0, 1.5, 0]), dy: -8 },
    { t: "FRENTE", at: project([0, -1.6, 1.5]), dy: 14 },
    { t: "DERECHA", at: project([1.5, -1.6, 0]), dy: 14 },
  ] : [];

  return (
    <svg width={size} height={size} viewBox={vb} style={{ display: "block", overflow: "visible" }} role="img" aria-label="Cubo de Rubik en perspectiva">
      <defs>
        {arrowEls.map((a) => (
          <marker key={"m" + a.i} id={`arh-${a.i}`} viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={a.color} />
          </marker>
        ))}
      </defs>

      {polys.map((p) => (
        <polygon key={p.key} points={ptsAttr(p.pts)} fill={p.fill} fillOpacity={p.opacity}
          stroke={T.stroke} strokeWidth={1.4} strokeLinejoin="round" />
      ))}

      {polys.filter((p) => p.isHi).map((p) => (
        <polygon key={"hi" + p.key} points={ptsAttr(p.pts)} fill="none"
          stroke={T.accent} strokeWidth={3} strokeLinejoin="round" />
      ))}

      {arrowEls.map((a) => (
        <line key={"a" + a.i} x1={a.p0[0].toFixed(2)} y1={a.p0[1].toFixed(2)} x2={a.p1[0].toFixed(2)} y2={a.p1[1].toFixed(2)}
          stroke={a.color} strokeWidth={3.2} strokeLinecap="round" markerEnd={`url(#arh-${a.i})`} />
      ))}

      {labelEls.map((l, i) => (
        <text key={"l" + i} x={l.at[0].toFixed(1)} y={(l.at[1] + l.dy).toFixed(1)}
          fill={T.muted} fontFamily="'JetBrains Mono', monospace" fontSize={9} letterSpacing={1.5} textAnchor="middle">{l.t}</text>
      ))}
    </svg>
  );
}
