/* Estados de diagrama y trazas de la última capa (planta / vista desde arriba).
   Los usa <Diagram> y el contenido de la Capa 3. */

/* Cruz: orientación de aristas (no es un único algoritmo → estados a mano).
   Regla: arista orientada -> amarillo ARRIBA, tab oscuro.
           arista no orientada -> arriba gris, tab AMARILLO. */
export const CROSS = {
  punto: { manual: true, mode: "oll", u: [["x", "x", "x"], ["x", "Y", "x"], ["x", "x", "x"]], t: { back: ["x", "Y", "x"], front: ["x", "Y", "x"], left: ["x", "Y", "x"], right: ["x", "Y", "x"] } },
  ele: { manual: true, mode: "oll", u: [["x", "Y", "x"], ["Y", "Y", "x"], ["x", "x", "x"]], t: { back: ["x", "x", "x"], front: ["x", "Y", "x"], left: ["x", "x", "x"], right: ["x", "Y", "x"] } },
  linea: { manual: true, mode: "oll", u: [["x", "x", "x"], ["Y", "Y", "Y"], ["x", "x", "x"]], t: { back: ["x", "Y", "x"], front: ["x", "Y", "x"], left: ["x", "x", "x"], right: ["x", "x", "x"] } },
  cruz: { manual: true, mode: "oll", u: [["x", "Y", "x"], ["Y", "Y", "Y"], ["x", "Y", "x"]], t: { back: ["x", "x", "x"], front: ["x", "x", "x"], left: ["x", "x", "x"], right: ["x", "x", "x"] } },
};

/* Traza exacta del movimiento de aristas (medida con el motor) */
export const TRACE_LINE = [
  { t: "IZQUIERDA → IZQUIERDA", v: false },
  { t: "FRENTE → DERECHA", v: true },
  { t: "DERECHA → ATRÁS", v: false },
  { t: "ATRÁS → FRENTE", v: true },
];
export const TRACE_L = [
  { t: "IZQUIERDA → IZQUIERDA", v: false },
  { t: "FRENTE → ATRÁS", v: true },
  { t: "ATRÁS → DERECHA", v: false },
  { t: "DERECHA → FRENTE", v: true },
];
export const TRACE_CORNERS = [
  { t: "FRENTE-IZQ → FRENTE-IZQ", v: false, fixed: true },
  { t: "ATRÁS-IZQ → ATRÁS-DER", v: false },
  { t: "ATRÁS-DER → FRENTE-DER", v: false },
  { t: "FRENTE-DER → ATRÁS-IZQ", v: false },
];
export const TRACE_CORNERS_POS = [
  { t: "FRENTE-DER → FRENTE-DER", v: false, fixed: true },
  { t: "ATRÁS-IZQ → FRENTE-IZQ", v: false },
  { t: "FRENTE-IZQ → ATRÁS-DER", v: false },
  { t: "ATRÁS-DER → ATRÁS-IZQ", v: false },
];
