import React from "react";
import Diagram from "./Diagram.jsx";
import CubeView from "./CubeView.jsx";
import BeforeAfter from "./BeforeAfter.jsx";
import CubeAnimation from "./CubeAnimation.jsx";
import { invertAlg, tokens, parseToken } from "../lib/cubeEngine.js";
import { T, FONT_DISPLAY, FONT_BODY, FONT_MONO } from "../lib/theme.js";

// Devuelve `alg` si es una secuencia de movimientos pura (parseable); si no, null.
function pureAlg(alg) {
  if (!alg) return null;
  try { const t = tokens(alg); if (!t.length) return null; t.forEach(parseToken); return alg; }
  catch { return null; }
}

/* Tarjeta de un caso/algoritmo.
   Visual: c.anim → cubo animado explícito; c.beforeAfter → dos cubos; c.cube →
   cubo en perspectiva; c.dia → diagrama de planta (última capa). Para los casos
   de última capa con algoritmo puro se añade además un cubo animado, derivado
   del mismo estado que el diagrama (setup = inverso del algoritmo). */
export default function AlgoCard({ c, big }) {
  // Animación: explícita, o derivada del diagrama de planta (no manual) del caso.
  let anim = c.anim;
  if (!anim && c.dia && !c.dia.manual && pureAlg(c.dia.alg)) {
    anim = { setup: invertAlg(c.dia.alg), moves: c.dia.alg, ms: 340 };
  }

  let visual;
  if (c.beforeAfter) visual = <BeforeAfter {...c.beforeAfter} size={big ? 130 : 116} />;
  else if (c.cube) visual = <CubeView {...c.cube} size={big ? 184 : 150} />;
  else if (c.dia || anim) {
    visual = (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {c.dia && <Diagram spec={c.dia} size={big ? 120 : 104} />}
        {anim && <CubeAnimation {...anim} size={big ? 168 : 150} />}
      </div>
    );
  } else visual = null;

  return (
    <div style={{ background: T.panel2, border: "1px solid " + T.line, borderRadius: 12, padding: 14, display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
      {visual && <div style={{ flexShrink: 0 }}>{visual}</div>}
      <div style={{ flex: 1, minWidth: 150 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, letterSpacing: 0.3, color: T.text, textTransform: "uppercase" }}>{c.name}</div>
        {c.alg && <div style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: T.accent, marginTop: 6, lineHeight: 1.7, wordBreak: "break-word" }}>{c.alg}</div>}
        {c.note && <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, marginTop: 8, lineHeight: 1.55 }}>{c.note}</div>}
        {c.trace && (
          <div style={{ marginTop: 10, borderTop: "1px solid " + T.line, paddingTop: 8 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>Cómo se mueve cada pieza</div>
            {c.trace.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontFamily: FONT_MONO, fontSize: 11.5, color: T.text, padding: "1.5px 0" }}>
                <span>{r.t}</span>
                <span style={{ color: r.fixed ? T.text : r.v ? T.accent : T.muted, flexShrink: 0 }}>{r.fixed ? "fija" : r.v ? "↻ voltea" : "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
