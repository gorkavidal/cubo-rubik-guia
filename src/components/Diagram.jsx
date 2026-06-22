import React, { useMemo } from "react";
import { llFromAlg } from "../lib/cubeEngine.js";
import { T } from "../lib/theme.js";

/* ===========================================================================
   DIAGRAMA DE ÚLTIMA CAPA  (SVG, correcto por construcción)
   mode 'oll' -> amarillo = sticker amarillo (arriba o asomando) / gris = oculto
   mode 'pll' -> cara U amarilla ; tabs con color real + realce de faros/barras
   =========================================================================== */
export default function Diagram({ spec, size = 132 }) {
  const model = useMemo(() => {
    if (spec.manual) return { u: spec.u, t: spec.t, mode: spec.mode || "oll" };
    const { u, t } = llFromAlg(spec.alg);
    return { u, t, mode: spec.mode };
  }, [spec]);

  const P = 10, TB = 11, G = 4, C = 30, g = 4;
  const grid = 3 * C + 2 * g;
  const gx = P + TB + G, gy = P + TB + G;
  const total = gx + grid + G + TB + P;

  const fillU = (v) => (model.mode === "pll" ? T.Y : v === "Y" ? T.Y : T.grayUp);
  const fillTab = (v) => (model.mode === "pll" ? (T[v] || T.tabDark) : v === "Y" ? T.Y : T.tabDark);

  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
    cells.push(<rect key={"u" + r + c} x={gx + c * (C + g)} y={gy + r * (C + g)} width={C} height={C} rx={4}
      fill={fillU(model.u[r][c])} stroke={T.stroke} strokeWidth={1.5} />);

  const tabRects = [];
  for (let c = 0; c < 3; c++) {
    tabRects.push(<rect key={"tb" + c} x={gx + c * (C + g)} y={gy - G - TB} width={C} height={TB} rx={2.5} fill={fillTab(model.t.back[c])} stroke={T.stroke} strokeWidth={1} />);
    tabRects.push(<rect key={"tf" + c} x={gx + c * (C + g)} y={gy + grid + G} width={C} height={TB} rx={2.5} fill={fillTab(model.t.front[c])} stroke={T.stroke} strokeWidth={1} />);
  }
  for (let r = 0; r < 3; r++) {
    tabRects.push(<rect key={"tl" + r} x={gx - G - TB} y={gy + r * (C + g)} width={TB} height={C} rx={2.5} fill={fillTab(model.t.left[r])} stroke={T.stroke} strokeWidth={1} />);
    tabRects.push(<rect key={"tr" + r} x={gx + grid + G} y={gy + r * (C + g)} width={TB} height={C} rx={2.5} fill={fillTab(model.t.right[r])} stroke={T.stroke} strokeWidth={1} />);
  }

  // realce de faros (ceja) y barras (recuadro) — sólo en PLL
  const marks = [];
  if (model.mode === "pll") {
    const o = 6, pad = 3.5;
    const cx = (i) => gx + i * (C + g) + C / 2;
    const cy = (i) => gy + i * (C + g) + C / 2;
    const sides = [
      { k: "back", horiz: true, outer: gy - G - TB, dir: -1 },
      { k: "front", horiz: true, outer: gy + grid + G + TB, dir: 1 },
      { k: "left", horiz: false, outer: gx - G - TB, dir: -1 },
      { k: "right", horiz: false, outer: gx + grid + G + TB, dir: 1 },
    ];
    sides.forEach((s, idx) => {
      const a = model.t[s.k];
      const bar = a[0] === a[1] && a[1] === a[2];
      const hl = !bar && a[0] === a[2];
      if (!bar && !hl) return;
      if (bar) {
        let x, y, w, h;
        if (s.horiz) { x = gx - pad; w = grid + 2 * pad; h = TB + 2 * pad; y = (s.k === "back" ? gy - G - TB : gy + grid + G) - pad; }
        else { y = gy - pad; h = grid + 2 * pad; w = TB + 2 * pad; x = (s.k === "left" ? gx - G - TB : gx + grid + G) - pad; }
        marks.push(<rect key={"bar" + idx} x={x} y={y} width={w} height={h} rx={4} fill="none" stroke={T.hl} strokeWidth={2} opacity={0.92} />);
      } else {
        const b = s.outer + s.dir * o;
        const pts = s.horiz
          ? `${cx(0)},${s.outer} ${cx(0)},${b} ${cx(2)},${b} ${cx(2)},${s.outer}`
          : `${s.outer},${cy(0)} ${b},${cy(0)} ${b},${cy(2)} ${s.outer},${cy(2)}`;
        marks.push(<polyline key={"hl" + idx} points={pts} fill="none" stroke={T.hl} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />);
      }
    });
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} style={{ display: "block" }}>
      <rect x={0} y={0} width={total} height={total} rx={10} fill={T.panel2} />
      {tabRects}{cells}{marks}
    </svg>
  );
}
