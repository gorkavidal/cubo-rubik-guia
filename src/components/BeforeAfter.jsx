import React from "react";
import CubeView from "./CubeView.jsx";
import { T, FONT_MONO } from "../lib/theme.js";

/* Muestra dos estados del cubo (antes → después) con el movimiento entre medias.
   Pensado para enseñar un gesto concreto de las primeras capas de forma visual.
   Props: before / after = props de CubeView; move = texto del movimiento (p.ej. "F2"). */
export default function BeforeAfter({ before, after, move, size = 124 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <figure style={{ margin: 0, textAlign: "center" }}>
        <CubeView {...before} size={size} />
        <figcaption style={{ fontFamily: FONT_MONO, fontSize: 9.5, letterSpacing: 1, color: T.muted, marginTop: 2 }}>ANTES</figcaption>
      </figure>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 44, padding: "0 2px" }}>
        {move && <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600, color: T.accent }}>{move}</span>}
        <span style={{ color: T.accent, fontSize: 22, lineHeight: 1 }} aria-hidden>→</span>
      </div>

      <figure style={{ margin: 0, textAlign: "center" }}>
        <CubeView {...after} size={size} />
        <figcaption style={{ fontFamily: FONT_MONO, fontSize: 9.5, letterSpacing: 1, color: T.muted, marginTop: 2 }}>DESPUÉS</figcaption>
      </figure>
    </div>
  );
}
