import React from "react";
import Collapsible from "./Collapsible.jsx";
import Diagram from "./Diagram.jsx";
import CubeView from "./CubeView.jsx";
import { CROSS } from "../content/diagrams.js";
import { T, FONT_BODY, FONT_MONO } from "../lib/theme.js";

function EdgeLabel({ children }) {
  return <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, letterSpacing: 1.5, color: T.muted, textAlign: "center" }}>{children}</span>;
}

export function HowToReadCube() {
  return (
    <Collapsible title="Cómo leer el cubo en perspectiva" open>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <CubeView alg="R U' R'" size={150} labels highlight={["U:2,2", "F:0,2", "R:0,0"]} arrows={[{ from: "U:2,2", to: "F:2,2" }]} />
        <p style={{ flex: "1 1 280px", fontFamily: FONT_BODY, fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          En las dos primeras capas vemos el cubo en perspectiva, con sus tres caras visibles: <span style={{ color: T.text }}>arriba</span>, <span style={{ color: T.text }}>frente</span> y <span style={{ color: T.text }}>derecha</span>. Lo sostienes siempre con el <span style={{ color: T.accent, fontWeight: 600 }}>amarillo arriba</span>. El <span style={{ color: T.accent, fontWeight: 600 }}>anillo amarillo</span> marca la pieza de la que hablamos y la <span style={{ color: T.text, fontWeight: 600 }}>flecha</span> su recorrido. Los colores son un ejemplo: en tu cubo, lo que manda es casar cada pieza con el <em>centro</em> de su cara.
        </p>
      </div>
    </Collapsible>
  );
}

export function HowToRead() {
  return (
    <Collapsible title="Cómo leer los diagramas de la última capa" open>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted, lineHeight: 1.6, margin: "2px 0 16px" }}>
        En la última capa, todos los diagramas miran el cubo desde arriba, en planta. El cuadrado 3×3 del centro es la cara superior (la que quieres dejar amarilla). Las fichas de alrededor son lo que asoma por los cuatro costados de la capa de arriba.
      </p>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 240px" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Orientar · OLL</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Diagram spec={{ alg: "R U R' U R U2 R'", mode: "oll" }} size={120} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, lineHeight: 1.55, margin: 0 }}>
              Pintamos de <span style={{ color: T.accent, fontWeight: 600 }}>amarillo</span> todo sticker que ya sea amarillo, mire arriba o asome por un lado. Una pieza <span style={{ color: T.text }}>gris</span> esconde su amarillo en un costado y el tab amarillo señala hacia dónde. Así reconoces la silueta sin tocar el cubo.
            </p>
          </div>
        </div>
        <div style={{ flex: "1 1 240px" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Colocar · PLL</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Diagram spec={{ alg: "R U' R U R U R U' R' U' R2", mode: "pll" }} size={120} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, lineHeight: 1.55, margin: 0 }}>
              La cara ya es amarilla, así que los costados llevan su color real. Dos iguales al mismo lado = <span style={{ color: T.text, fontWeight: 600 }}>faros</span> (ceja); tres iguales = <span style={{ color: T.text, fontWeight: 600 }}>barra</span> (recuadro). Marcan el bloque ya montado e identifican el caso.
            </p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr auto 1fr", gridAutoRows: "auto", alignItems: "center", justifyItems: "center", maxWidth: 320, gap: 6 }}>
        <div /><EdgeLabel>DETRÁS</EdgeLabel><div />
        <EdgeLabel>IZQ</EdgeLabel>
        <Diagram spec={CROSS.cruz} size={120} />
        <EdgeLabel>DER</EdgeLabel>
        <div /><EdgeLabel>DELANTE</EdgeLabel><div />
      </div>
    </Collapsible>
  );
}

export function NotationLegend() {
  const rows = [
    ["R L U D F B", "Gira esa cara 90° en sentido horario (vista de frente)."],
    ["X'", "Apóstrofo = el mismo giro, pero antihorario."],
    ["X2", "El 2 = giro doble (180°); da igual el sentido."],
    ["r l u d f b", "Minúscula = giro amplio: arrastra también la capa central contigua."],
    ["M E S", "Capas centrales. M sigue a L, E sigue a D, S sigue a F."],
    ["x y z", "Gira el cubo entero sobre el eje R / U / F. No resuelve, sólo reorienta."],
  ];
  return (
    <Collapsible title="Cómo leer la notación">
      {rows.map(([k, v], i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "8px 0", borderTop: i ? "1px solid " + T.line : "none", alignItems: "baseline" }}>
          <code style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.accent, minWidth: 96, flexShrink: 0 }}>{k}</code>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{v}</span>
        </div>
      ))}
    </Collapsible>
  );
}
