/* ===========================================================================
   CAPA 1 · PRIMERA CAPA (cara blanca)
   Enfoque: blanco ARRIBA mientras la construyes (se ve de frente y es lo más
   intuitivo); al terminar, voltea el cubo para dejar el blanco abajo y seguir.
   Los diagramas usan el visor en perspectiva con el cubo resuelto y blanco
   arriba (alg "x2"), resaltando la pieza y su recorrido.
   =========================================================================== */

export const LAYER1 = {
  id: "capa-1",
  title: "Capa 1 · La cara blanca",
  short: "Capa 1",
  intro: "Empezamos por abajo: una cara entera (elegimos la blanca) con su primera capa. Se construye «a mano», sin algoritmos que memorizar, mirando colores. Para verla bien la montamos con el blanco ARRIBA; al acabar, damos la vuelta al cubo para dejar el blanco abajo y atacar lo que queda.",
  idea: "La primera capa no necesita trucos: necesita que entiendas que cada pieza tiene dos o tres colores y que sólo entra «bien» en un único hueco. Si te fijas en los colores y casas cada pieza con los centros, sale sola.",
  steps: [
    {
      id: "cruz-blanca", title: "La cruz blanca",
      goal: "Las 4 aristas blancas formando una cruz en la cara de arriba, y —esto es lo que casi todos olvidan— cada una con su segundo color tocando el centro de su cara. No basta con que el blanco mire arriba: la arista blanco-azul va en la cara azul, la blanco-roja en la roja, etc.",
      why: "Los centros no se mueven entre sí: marcan qué color es cada cara para siempre. Una arista tiene dos colores y un solo sitio correcto: el que hace que su blanco mire arriba y su otro color quede pegado al centro del mismo color. Por eso la regla es «mira el lado, no sólo el blanco»: si casas el color lateral con su centro, la arista cae en su hueco. Si una arista está en su sitio pero con el blanco mirando al lado en vez de arriba, está sólo girada: sácala y vuelve a meterla con el blanco hacia arriba. Trabajamos con el blanco arriba porque así ves a la vez el blanco (arriba) y el color que tiene que casar (en el costado), sin adivinar nada.",
      cases: [
        {
          name: "Arista bien colocada", alg: "",
          note: "Blanco mirando ARRIBA y el otro color (aquí azul) pegado a su centro azul. Ese es el objetivo de cada una de las cuatro. Si el color lateral no casa con el centro, la arista está en el hueco equivocado.",
          cube: { alg: "x2", labels: true, dim: true, highlight: ["U:2,1", "F:0,1"] },
        },
        {
          name: "Subir una arista de abajo", alg: "",
          note: "Si la arista blanca está en la capa de abajo o en un costado, gírala hasta dejarla justo debajo de su hueco (con el color lateral ya casando con el centro) y súbela girando esa cara. La flecha marca el recorrido: del costado a la cruz.",
          cube: { alg: "x2", dim: true, highlight: ["U:1,2"], arrows: [{ from: "R:1,0", to: "U:1,2" }] },
        },
      ],
      done: {
        name: "Cruz blanca completa", alg: "",
        note: "Las cuatro aristas con el blanco arriba y sus colores casando alrededor. Mirando desde arriba se ve una cruz blanca con un brazo de cada color lateral.",
        cube: { alg: "x2", labels: true, highlight: ["U:0,1", "U:1,0", "U:1,1", "U:1,2", "U:2,1"] },
      },
    },
    {
      id: "esquinas-blancas", title: "Las esquinas blancas",
      goal: "Rellenar las 4 esquinas de la cara blanca. Cada esquina tiene tres colores: blanco + los dos de las caras que toca. Va al único rincón donde sus tres colores coinciden con los tres centros que la rodean.",
      why: "Para meter una esquina sin romper la cruz se usa un gesto repetible: la colocas en la capa de abajo, justo debajo del rincón donde tiene que ir, y haces «sacar y meter» — baja el rincón, gira la capa de abajo, sube el rincón (el clásico R U R' U' por ese lado) — una y otra vez. Cada repetición la asoma y la vuelve a guardar; cuando la orientación cuadra, se queda encajada con el blanco arriba sin haber estropeado nada. Es el mismo principio que usarás en toda la resolución: un movimiento que toca y devuelve, repetido hasta que la pieza cae en su sitio. Si una esquina blanca está ya arriba pero girada o en el rincón equivocado, sácala a la capa de abajo y vuelve a entrarla bien.",
      cases: [
        {
          name: "Esquina en su rincón", alg: "",
          note: "Blanco arriba y sus otros dos colores (azul y rojo) casando con las caras azul y roja. Las tres pegatinas coinciden con los tres centros que rodean ese rincón.",
          cube: { alg: "x2", labels: true, dim: true, highlight: ["U:2,2", "F:0,2", "R:0,0"] },
        },
        {
          name: "Meter una esquina (sacar y meter)", alg: "R U R' U'",
          note: "Pon la esquina blanca en la capa de abajo, bajo su rincón. Repite el gesto de sacar y meter por ese lado hasta que el blanco quede arriba. La flecha marca el rincón de destino.",
          cube: { alg: "x2", dim: true, highlight: ["U:2,2", "F:0,2", "R:0,0"], arrows: [{ from: "R:2,0", to: "R:0,0" }] },
        },
      ],
      done: {
        name: "Primera capa terminada", alg: "",
        note: "Cara blanca completa y, alrededor, la primera fila de cada color casa con su centro. Ahora VOLTEA el cubo: blanco abajo, amarillo arriba. Lo que falta queda todo en la parte de arriba.",
        cube: { alg: "x2", labels: true },
      },
    },
  ],
};
