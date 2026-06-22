/* ===========================================================================
   CAPA 2 · SEGUNDA CAPA (aristas del medio)
   El cubo ya está volteado: blanco abajo (primera capa hecha), amarillo arriba.
   Insertamos las 4 aristas de la franja del medio desde la capa de arriba.
   Los diagramas de cada caso son el estado REAL a reconocer: se generan
   aplicando el inverso del algoritmo al cubo resuelto (mismo truco que la
   última capa) → correcto por construcción y verificado con el motor.
   =========================================================================== */
import { invertAlg } from "../lib/cubeEngine.js";

const RIGHT = "U R U' R' U' F' U F";  // inserta a la derecha
const LEFT = "U' L' U L U F U' F'";   // inserta a la izquierda

export const LAYER2 = {
  id: "capa-2",
  title: "Capa 2 · La franja del medio",
  short: "Capa 2",
  intro: "Con la primera capa abajo, faltan las 4 aristas del medio. Ninguna lleva amarillo (ese color va arriba), así que se reconocen fácil. Cada una se mete desde la capa de arriba con un pequeño algoritmo: uno para la derecha y su espejo para la izquierda. Son los dos primeros algoritmos «de verdad» del método, y muy fáciles de recordar.",
  idea: "Las aristas del medio no tienen amarillo. Usas la capa de arriba como almacén: colocas la arista arriba, haces que su cara frontal coincida con el centro de su cara, y el color que le queda mirando al cielo te dice hacia qué lado baja. El algoritmo abre un hueco en la franja media, mete la arista y vuelve a cerrar — sin tocar la primera capa.",
  steps: [
    {
      id: "insertar-aristas", title: "Insertar las aristas del medio",
      goal: "Llevar cada arista sin amarillo a su hueco en la franja central, con sus dos colores casando con los centros de las dos caras que toca.",
      why: "Coloca la arista en la capa de arriba y gírala (con U) hasta que su pegatina frontal sea del mismo color que el centro de esa cara: queda formando una pequeña T. Entonces mira su pegatina de arriba. Si es del color de la cara DERECHA, baja a la derecha; si es del color de la IZQUIERDA, baja a la izquierda. El algoritmo de ese lado hace el resto: aparta la primera capa un instante, encaja la arista y la recompone. Los dos algoritmos son idénticos salvo que cambian R↔L y F↔F en espejo — si te sabes uno, te sabes los dos. ¿Y si la arista que buscas ya está en la franja media pero mal (girada o en otro hueco)? Mete cualquier arista de arriba en ese hueco con el algoritmo: la tuya saltará a la capa de arriba y entonces la colocas bien.",
      cases: [
        {
          name: "Insertar a la DERECHA", alg: RIGHT,
          note: "La arista de arriba muestra su color frontal igual al centro del frente (verde con verde) y, mirando al cielo, el color de la cara derecha (rojo). Baja a la derecha. La flecha señala el hueco de destino.",
          cube: { alg: invertAlg(RIGHT), labels: true, highlight: ["U:2,1", "F:0,1"], arrows: [{ from: "U:2,1", to: "F:1,2" }] },
        },
        {
          name: "Insertar a la IZQUIERDA", alg: LEFT,
          note: "Mismo planteamiento en espejo: frontal casando con el centro (verde con verde) y arriba el color de la cara izquierda (naranja). Baja a la izquierda. Es el mismo algoritmo cambiando derecha por izquierda.",
          cube: { alg: invertAlg(LEFT), labels: true, highlight: ["U:2,1", "F:0,1"], arrows: [{ from: "U:2,1", to: "F:1,0" }] },
        },
        {
          name: "Arista atrapada (sácala primero)", alg: "U R U' R' U' F' U F",
          note: "Si la arista correcta ya está en la franja media pero girada o en el hueco equivocado, aplica una vez el algoritmo de ese lado para expulsarla a la capa de arriba; aparecerá lista para reinsertarla bien.",
          cube: { alg: invertAlg(RIGHT), dim: true, highlight: ["F:1,2"], arrows: [{ from: "F:1,2", to: "U:2,1" }] },
        },
      ],
      done: {
        name: "Dos primeras capas hechas", alg: "",
        note: "Las dos franjas de abajo de cada cara, completas. Sólo queda la última capa (amarilla) arriba: a por la Capa 3.",
        cube: { alg: "R U2 R' U' R U' R'", labels: true },
      },
    },
  ],
};
