import React, { useState } from "react";
import { LAYERS } from "./content/index.js";
import AlgoCard from "./components/AlgoCard.jsx";
import CubeView from "./components/CubeView.jsx";
import Diagram from "./components/Diagram.jsx";
import { HowToRead, HowToReadCube, NotationLegend } from "./components/Legends.jsx";
import { T, FONT_DISPLAY, FONT_BODY, FONT_MONO } from "./lib/theme.js";

/* --- Render de los casos de un paso (lista / rejilla / grupos) --- */
function Cases({ step }) {
  if (step.groups) {
    return step.groups.map((grp) => (
      <div key={grp.label} style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 12.5, letterSpacing: 1.5, textTransform: "uppercase", color: T.text, margin: "0 2px 6px" }}>{grp.label}</div>
        {grp.blurb && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, lineHeight: 1.55, margin: "0 2px 12px", maxWidth: 720 }}>{grp.blurb}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {grp.cases.map((c) => <AlgoCard key={c.name} c={c} />)}
        </div>
      </div>
    ));
  }
  if (step.grid) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 22 }}>
        {step.cases.map((c) => <AlgoCard key={c.name} c={c} />)}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
      {step.cases.map((c) => <AlgoCard key={c.name} c={c} big />)}
      {step.done && (
        <div style={{ display: "flex", gap: 14, alignItems: "center", border: "1px dashed " + T.line, borderRadius: 12, padding: 14, flexWrap: "wrap" }}>
          <div style={{ flexShrink: 0 }}>
            {step.done.cube
              ? <AlgoCardVisualOnly c={step.done} />
              : null}
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: T.G, textTransform: "uppercase", letterSpacing: 0.3 }}>{step.done.name}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, marginTop: 6, lineHeight: 1.55 }}>{step.done.note}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* El bloque "hecho" muestra sólo el visual (cube o dia). */
function AlgoCardVisualOnly({ c }) {
  if (c.cube) return <CubeView {...c.cube} size={150} />;
  if (c.dia) return <Diagram spec={c.dia} size={104} />;
  return null;
}

/* --- Tarjeta de etapa: objetivo + por qué funciona --- */
function StepHeader({ step }) {
  return (
    <div style={{ background: T.panel, border: "1px solid " + T.line, borderRadius: 16, padding: "22px 22px 24px", marginBottom: 18 }}>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: -0.2, margin: 0, textTransform: "uppercase" }}>{step.title}</h2>
      <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: T.text, margin: "10px 0 0", lineHeight: 1.6 }}>{step.goal}</p>
      {step.why && (
        <div style={{ borderLeft: "3px solid " + T.accent, background: T.panel2, borderRadius: "0 10px 10px 0", padding: "12px 16px", margin: "16px 0 4px" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>¿Por qué funciona?</div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted, margin: 0, lineHeight: 1.65 }}>{step.why}</p>
        </div>
      )}
    </div>
  );
}

function Button({ children, active, onClick, disabled, primary }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13, padding: "10px 18px", borderRadius: 10,
        cursor: disabled ? "default" : "pointer",
        background: disabled ? "transparent" : primary ? T.accent : active ? T.panel2 : "transparent",
        border: "1px solid " + (disabled ? T.line : primary || active ? T.accent : T.line),
        color: disabled ? T.line : primary ? "#1A1A1A" : active ? T.text : T.muted,
        opacity: disabled ? 0.5 : 1, transition: "all .15s",
      }}>
      {children}
    </button>
  );
}

export default function App() {
  const [layerIdx, setLayerIdx] = useState(0);
  const [methodIdx, setMethodIdx] = useState(0);
  const [step, setStep] = useState(0);

  const layer = LAYERS[layerIdx];
  const method = layer.type === "methods" ? layer.methods[methodIdx] : null;
  const steps = layer.type === "methods" ? method.data.steps : layer.steps;
  const activeStep = steps[Math.min(step, steps.length - 1)];
  const layerIntro = layer.type === "methods" ? method.data.intro : layer.intro;

  const goLayer = (i) => { setLayerIdx(i); setMethodIdx(0); setStep(0); window.scrollTo({ top: 0 }); };
  const goMethod = (i) => { setMethodIdx(i); setStep(0); };

  // Navegación secuencial que cruza capas (tutorial completo de corrido).
  const atFirst = layerIdx === 0 && step === 0;
  const atLast = layerIdx === LAYERS.length - 1 && step === steps.length - 1;
  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else if (layerIdx < LAYERS.length - 1) goLayer(layerIdx + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
    else if (layerIdx > 0) {
      const pi = layerIdx - 1, pl = LAYERS[pi];
      const ps = pl.type === "methods" ? pl.methods[0].data.steps : pl.steps;
      setLayerIdx(pi); setMethodIdx(0); setStep(ps.length - 1); window.scrollTo({ top: 0 });
    }
  };

  const isCube = layer.type === "steps"; // capas 1 y 2 usan el visor en perspectiva

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: FONT_BODY, padding: "28px 18px 60px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Cabecera */}
        <header style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.accent, letterSpacing: 2, textTransform: "uppercase" }}>Cubo de Rubik · Guía visual</div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: -0.5, margin: "6px 0 0", textTransform: "uppercase", lineHeight: 1.05 }}>Resolver el cubo capa a capa</h1>
        </header>

        {/* La idea de fondo */}
        <div style={{ borderLeft: "3px solid " + T.accent, background: T.panel, borderRadius: "0 12px 12px 0", padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>La idea de fondo</div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: T.text, margin: 0, lineHeight: 1.6 }}>
            Se resuelve <strong style={{ color: T.text }}>de abajo hacia arriba, capa por capa</strong>: primero una cara entera con su primera capa (la blanca), luego la franja del medio, y al final la capa de arriba (la amarilla). Cada pieza guarda dos datos: <strong style={{ color: T.text }}>en qué hueco está</strong> (posición) y <strong style={{ color: T.text }}>hacia dónde mira</strong> (orientación). Casi todo el método consiste en cambiar uno sin estropear lo ya hecho.
          </p>
        </div>

        {isCube ? <HowToReadCube /> : <HowToRead />}

        {/* Selector de CAPA */}
        <nav aria-label="Capas" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {LAYERS.map((l, i) => {
            const on = i === layerIdx;
            return (
              <button key={l.id} onClick={() => goLayer(i)}
                style={{
                  flex: "1 1 200px", textAlign: "left", padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                  background: on ? T.panel2 : T.panel, border: "1px solid " + (on ? T.accent : T.line),
                  color: on ? T.text : T.muted, transition: "all .15s",
                }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: on ? T.accent : T.muted }}>CAPA {l.n}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.2, marginTop: 3 }}>{l.title}</div>
              </button>
            );
          })}
        </nav>

        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted, margin: "0 0 16px", lineHeight: 1.55 }}>{layerIntro}</p>

        {/* Selector de método (sólo Capa 3) */}
        {layer.type === "methods" && (
          <div style={{ display: "inline-flex", flexWrap: "wrap", background: T.panel, border: "1px solid " + T.line, borderRadius: 12, padding: 4, marginBottom: 18 }}>
            {layer.methods.map((m, i) => (
              <button key={m.id} onClick={() => goMethod(i)}
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", padding: "9px 16px", borderRadius: 9, border: "none", cursor: "pointer", background: i === methodIdx ? T.accent : "transparent", color: i === methodIdx ? "#1A1A1A" : T.muted, transition: "all .15s" }}>
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* Stepper */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
          {steps.map((s, i) => {
            const on = i === step;
            return (
              <button key={s.id} onClick={() => setStep(i)}
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 12.5, letterSpacing: 0.3, padding: "8px 14px", borderRadius: 10, cursor: "pointer", background: on ? T.panel2 : "transparent", border: "1px solid " + (on ? T.accent : T.line), color: on ? T.text : T.muted, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: on ? T.accent : T.muted }}>{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </button>
            );
          })}
        </div>

        <StepHeader step={activeStep} />
        <Cases step={activeStep} />

        {/* Navegación secuencial (cruza capas) */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 22 }}>
          <Button onClick={prev} disabled={atFirst}>← Anterior</Button>
          <Button onClick={next} disabled={atLast} primary={!atLast}>Siguiente →</Button>
        </div>

        <NotationLegend />

        <footer style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: T.muted, marginTop: 8, lineHeight: 1.5, opacity: 0.8 }}>
          <p style={{ margin: "0 0 6px" }}>
            Diagramas generados por un motor de cubo propio: cada caso es un estado real del cubo, no un dibujo aproximado. Los de la última capa se ven en planta (faros y barras como guía); los de las dos primeras, en perspectiva.
          </p>
          <p style={{ margin: 0 }}>
            Algoritmos PLL según el catálogo de Feliks Zemdegs (cubeskills); 2-look OLL del repertorio estándar de speedcubing. Capas 1 y 2 por el método principiante clásico.
          </p>
        </footer>
      </div>
    </div>
  );
}
