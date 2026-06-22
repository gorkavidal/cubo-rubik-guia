/* Ensambla todo el contenido en una estructura de navegación por capas. */
import { LAYER1 } from "./layer1.js";
import { LAYER2 } from "./layer2.js";
import { SIMPLE, ALT, OPT } from "./layer3.js";

export const LAYERS = [
  {
    id: "capa-1", n: 1, short: "Capa 1", title: "La cara blanca",
    type: "steps", intro: LAYER1.intro, idea: LAYER1.idea, steps: LAYER1.steps,
  },
  {
    id: "capa-2", n: 2, short: "Capa 2", title: "La franja del medio",
    type: "steps", intro: LAYER2.intro, idea: LAYER2.idea, steps: LAYER2.steps,
  },
  {
    id: "capa-3", n: 3, short: "Capa 3", title: "La última capa (amarilla)",
    type: "methods",
    intro: "La capa final. Aquí sí entran los algoritmos, y tienes tres caminos según lo que busques: del más sencillo de entender al de velocidad. Elige uno.",
    methods: [
      { id: "simplificada", label: "Simplificada", data: SIMPLE },
      { id: "alternativa", label: "Alternativa", data: ALT },
      { id: "optimizada", label: "Optimizada", data: OPT },
    ],
  },
];
