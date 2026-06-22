import React, { useEffect, useReducer, useRef, useState } from "react";
import { solved, applyAlg, doToken, parseToken, tokens, AXIS } from "../lib/cubeEngine.js";
import { project, rotateAngle, stickerCenter3d, stickerCorners3d, isVisible, depth, fullCubeBBox } from "../lib/isoProjection.js";
import { T, FONT_MONO } from "../lib/theme.js";

/* ===========================================================================
   CUBO ANIMADO — reproduce una secuencia girando las capas de verdad.
   Render por sticker (proyección iso), con rotación suave de la capa activa,
   orden de profundidad correcto y bucle. Muestra la secuencia con el paso
   actual resaltado. Pensado para ILUSTRAR los gestos en movimiento.

   Props:
     setup   string  — estado de partida (alg aplicado desde el cubo resuelto)
     moves   string  — secuencia a animar, p.ej. "R U' R' U2 R U R'"
     size    number   — lado del SVG
     ms      number   — duración por movimiento (def. 430)
     labels  bool      — rotula ARRIBA / FRENTE / DERECHA
   =========================================================================== */

const INSET = 0.86;
const PAUSE = 1100; // ms entre repeticiones

function shadeOf(n) {
  // 1.0 mirando arriba, 0.93 al frente, 0.85 a la derecha; interpola suave al rotar.
  return 0.85 + 0.15 * Math.max(0, n[1]) + 0.08 * Math.max(0, n[2]);
}
function shade(hex, f) {
  const v = parseInt(hex.slice(1), 16);
  const r = Math.round(((v >> 16) & 255) * f), g = Math.round(((v >> 8) & 255) * f), b = Math.round((v & 255) * f);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const ptsAttr = (pts) => pts.map((q) => q[0].toFixed(2) + "," + q[1].toFixed(2)).join(" ");

export default function CubeAnimation({ setup = "", moves = "", size = 168, ms = 430, labels = false }) {
  const list = tokens(moves);
  const [playing, setPlaying] = useState(() =>
    !(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
  const [, force] = useReducer((x) => x + 1, 0);

  // Estado de animación en refs (no provoca render por sí mismo).
  const baseRef = useRef(null);   // estado del cubo tras setup + moves ya completados
  const idxRef = useRef(0);       // índice del movimiento en curso
  const fracRef = useRef(0);      // progreso 0..1 del movimiento en curso
  const phaseRef = useRef("move"); // 'move' | 'pause'
  const t0Ref = useRef(0);

  const resetBase = () => { const st = solved(); if (setup) applyAlg(st, setup); baseRef.current = st; idxRef.current = 0; fracRef.current = 0; phaseRef.current = list.length ? "move" : "pause"; };
  if (baseRef.current === null) resetBase();

  useEffect(() => { resetBase(); force(); /* re-init si cambian props */ // eslint-disable-next-line
  }, [setup, moves]);

  useEffect(() => {
    if (!playing) return;
    let raf, started = null;
    const step = (now) => {
      if (started === null) { started = now; t0Ref.current = now; }
      const t = now - t0Ref.current;
      if (phaseRef.current === "move") {
        if (idxRef.current >= list.length) { phaseRef.current = "pause"; t0Ref.current = now; }
        else {
          fracRef.current = Math.min(t / ms, 1);
          if (fracRef.current >= 1) {
            doToken(baseRef.current, list[idxRef.current]); // fija el estado discreto
            idxRef.current += 1; fracRef.current = 0; t0Ref.current = now;
            if (idxRef.current >= list.length) { phaseRef.current = "pause"; }
          }
        }
      } else { // pause → reiniciar el bucle
        if (t > PAUSE) { resetBase(); t0Ref.current = now; }
      }
      force();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [playing, moves, setup, ms]);

  // ---- construir el fotograma actual ----
  const st = baseRef.current;
  const idx = idxRef.current;
  const moving = phaseRef.current === "move" && idx < list.length;
  let axis = null, coords = null, theta = 0;
  if (moving) {
    const pt = parseToken(list[idx]);
    axis = pt.axis; coords = pt.coords;
    theta = fracRef.current * pt.sign * (Math.PI / 2) * pt.times;
  }
  const ai = axis ? AXIS[axis] : -1;

  const polys = [];
  for (const sk of st) {
    const inLayer = moving && coords.includes(sk.p[ai]);
    let n = sk.n, center = stickerCenter3d(sk.p, sk.n), corners = stickerCorners3d(sk.p, sk.n, INSET);
    if (inLayer) {
      n = rotateAngle(sk.n, axis, theta);
      center = rotateAngle(center, axis, theta);
      corners = corners.map((c) => rotateAngle(c, axis, theta));
    }
    if (!isVisible(n)) continue;
    polys.push({ pts: corners.map(project), fill: shade(T[sk.c] || T.tabDark, shadeOf(n)), d: depth(center) });
  }
  polys.sort((a, b) => a.d - b.d); // lejanos primero

  const vb = fullCubeBBox(15);

  const labelEls = labels ? [
    { t: "ARRIBA", at: project([0, 1.5, 0]), dy: -8 },
    { t: "FRENTE", at: project([0, -1.6, 1.5]), dy: 14 },
    { t: "DERECHA", at: project([1.5, -1.6, 0]), dy: 14 },
  ] : [];

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ display: "block", overflow: "visible" }} role="img" aria-label="Cubo de Rubik animado">
        {polys.map((p, i) => (
          <polygon key={i} points={ptsAttr(p.pts)} fill={p.fill} stroke={T.stroke} strokeWidth={1.4} strokeLinejoin="round" />
        ))}
        {labelEls.map((l, i) => (
          <text key={"l" + i} x={l.at[0].toFixed(1)} y={(l.at[1] + l.dy).toFixed(1)} fill={T.muted} fontFamily="'JetBrains Mono', monospace" fontSize={9} letterSpacing={1.5} textAnchor="middle">{l.t}</text>
        ))}
      </svg>

      {/* Secuencia con el paso actual resaltado + control */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pausar" : "Reproducir"}
          style={{ background: "transparent", border: "1px solid " + T.line, color: T.text, borderRadius: 8, width: 26, height: 26, cursor: "pointer", lineHeight: 1, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {playing ? "❚❚" : "▶"}
        </button>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {list.map((tk, i) => (
            <span key={i} style={{ fontFamily: FONT_MONO, fontSize: 12, padding: "2px 6px", borderRadius: 6, background: moving && i === idx ? T.accent : "transparent", color: moving && i === idx ? "#1A1A1A" : (i < idx || !moving ? T.muted : T.text), border: "1px solid " + (moving && i === idx ? T.accent : T.line), transition: "all .1s" }}>{tk}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
