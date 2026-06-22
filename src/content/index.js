/* Ensambla todo el contenido en una estructura de navegación por capas. */
import { LAYER1 } from "./layer1.js";
import { LAYER2 } from "./layer2.js";
import { SENCILLO, OPT } from "./layer3.js";

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
    intro: "La capa final. Aquí sí entran los algoritmos, y tienes dos caminos: el método sencillo de principiante (sin reconocer casos) o el optimizado de velocidad. Elige uno.",
    methods: [
      { id: "sencillo", label: "Sencillo", data: SENCILLO },
      { id: "optimizado", label: "Optimizado", data: OPT },
    ],
  },
];
