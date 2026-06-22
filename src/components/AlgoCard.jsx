import React from "react";
import Diagram from "./Diagram.jsx";
import CubeView from "./CubeView.jsx";
import BeforeAfter from "./BeforeAfter.jsx";
import { T, FONT_DISPLAY, FONT_BODY, FONT_MONO } from "../lib/theme.js";

/* Tarjeta de un caso/algoritmo.
   Visual: c.beforeAfter → dos cubos (antes→después); c.cube → cubo en perspectiva;
           c.dia → diagrama de planta (última capa).
   Texto: name, alg (notación), note, y opcional trace (cómo se mueve cada pieza). */
export default function AlgoCard({ c, big }) {
  const visual = c.beforeAfter
    ? <BeforeAfter {...c.beforeAfter} size={big ? 130 : 116} />
    : c.cube
      ? <CubeView {...c.cube} size={big ? 184 : 150} />
      : c.dia
        ? <Diagram spec={c.dia} size={big ? 132 : 104} />
        : null;

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
