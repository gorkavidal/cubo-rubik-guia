/* ===========================================================================
   CAPA 1 · PRIMERA CAPA (cara blanca) — enseñada de forma RAZONADA
   No "aplica este algoritmo": aprender a LEER el cubo (qué pieza, dónde vive,
   hacia dónde mira) y razonar el movimiento. Amarillo siempre arriba.
   Estados de los diagramas verificados con el motor.
   =========================================================================== */

export const LAYER1 = {
  id: "capa-1",
  title: "Capa 1 · La cara blanca",
  short: "Capa 1",
  intro: "La primera capa se hace pensando, no de memoria. Aquí no vas a aplicar fórmulas a ciegas: vas a aprender a leer el cubo —qué es cada pieza y a dónde pertenece— y a mover con intención. Sostén el cubo con el centro amarillo mirando arriba y déjalo así toda la capa.",
  idea: "Las dos primeras capas se resuelven razonando, no recitando. Si entiendes qué pieza tienes delante y dónde es su sitio, el movimiento casi se piensa solo. Los pocos gestos que usamos son cortos y vas a entender qué hace cada uno.",
  steps: [
    {
      id: "mirar", title: "Primero: aprende a mirar",
      goal: "Antes de tocar nada, hay que saber leer el cubo. Con tres ideas lo verás de otra forma y todo lo demás cae por su propio peso. Dedícale un minuto: es lo que separa resolver de memorizar.",
      whyLabel: "Las tres claves para leer el cubo",
      why: [
        "1) Los centros mandan. La pieza del medio de cada cara no se mueve de sitio respecto a las demás: define de qué color es esa cara para siempre. Si el centro de abajo es blanco, la cara de abajo será la blanca; el de arriba, amarillo. Resolver el cubo no es «pintar caras», es llevar cada pieza junto a los centros que le corresponden.",
        "2) Hay tres tipos de pieza. Los centros (una sola pegatina). Las aristas, en mitad de cada borde, con dos pegatinas: hay 12. Y las esquinas, en los vértices, con tres pegatinas: hay 8. Esto es lo importante: una pieza solo encaja en UN sitio. La arista blanco-verde solo tiene un hogar —el borde entre la cara blanca y la verde— porque es la única que tiene esos dos colores. Mira los colores de una pieza y sabrás exactamente a dónde va.",
        "3) Posición y orientación son cosas distintas. Una pieza puede estar en su sitio pero girada del revés. «Resuelta» significa sitio correcto Y bien orientada. En la cruz, una arista blanca puede estar en el borde correcto pero con el blanco mirando al lado en vez de hacia el centro blanco: está medio resuelta, hay que darle la vuelta. Acostúmbrate a preguntarte siempre dos cosas: ¿está en su sitio? y ¿está bien girada?",
      ],
      grid: true,
      cases: [
        { name: "Los centros no se mueven", note: "Las tres piezas centrales (amarillo arriba, verde y rojo) marcan el color de su cara. Gires lo que gires, su posición relativa no cambia: son tu mapa.", cube: { alg: "", labels: true, highlight: ["U:1,1", "F:1,1", "R:1,1"] } },
        { name: "Una arista = 2 colores", note: "Las aristas viven en mitad de los bordes. Esta tiene amarillo y verde: su hogar es el borde entre la cara amarilla y la verde. Sus dos colores te dicen dónde va.", cube: { alg: "", labels: true, highlight: ["U:2,1", "F:0,1"] } },
        { name: "Una esquina = 3 colores", note: "Las esquinas viven en los vértices. Esta tiene amarillo, verde y rojo: solo encaja en el rincón donde se juntan esas tres caras. Tres colores, un único rincón.", cube: { alg: "", labels: true, highlight: ["U:2,2", "F:0,2", "R:0,0"] } },
      ],
    },
    {
      id: "cruz-blanca", title: "La cruz blanca",
      goal: "Las cuatro aristas que llevan blanco, colocadas alrededor del centro blanco y —esto es lo que casi todos olvidan— cada una con su segundo color pegado al centro de su color. Una cruz bien hecha tiene los cuatro brazos casando: el tramo blanco-rojo toca el centro rojo, el blanco-verde toca el verde…",
      whyLabel: "Cómo razonarla (no es magia)",
      why: [
        "Coge cualquier arista que tenga blanco y hazte las dos preguntas de siempre: ¿dónde está? y ¿a dónde va? Su segundo color responde lo segundo: la blanco-roja va a la cara roja, sin más. El problema es que su sitio final está ABAJO, donde no lo ves bien. Solución: reúne primero las cuatro aristas blancas ARRIBA, formando una flor (la «margarita») alrededor del centro amarillo. Arriba las ves todas y las mueves con comodidad. Por eso empezamos por la flor: no es un truco, es ponerte el trabajo donde lo controlas.",
        "Con la flor hecha, baja las aristas una a una, pero PENSANDO. Antes de bajar un pétalo, gira solo la cara de arriba hasta que el segundo color de ese pétalo quede pegado al centro de su misma cara (verde con verde). ¿Por qué alinear primero? Porque al bajarla la arista se queda en esa misma cara, solo que abajo. Si arriba ya casaba, abajo casará: cae perfecta. Si bajas sin mirar, caerá con los colores cruzados y tendrás que repetirlo.",
        "¿Y por qué se baja con un giro DOBLE de la cara (180°) y no uno simple? Porque medio giro mantiene la arista en su misma cara, llevándola en línea recta de arriba abajo, sin volcarla a otra cara y sin tocar las aristas vecinas (que están en otras caras). Por eso puedes colocar las cuatro sin que se estorben entre sí. Cuando entiendes esto, ya no «aplicas F2»: sabes que estás bajando esa arista por su columna.",
      ],
      cases: [
        {
          name: "1 · Reúne las aristas: la margarita",
          note: "Sube las cuatro aristas con blanco a la cara de arriba, alrededor del amarillo, con el blanco mirando al cielo. No te fijes aún en el otro color: aquí solo las juntas. Quedan como los pétalos de una flor.",
          cube: { alg: "F2 R2 B2 L2", labels: true, highlight: ["U:0,1", "U:1,0", "U:1,2", "U:2,1"] },
        },
        {
          name: "2 · Alinea cada pétalo y bájalo",
          alg: "F2  ·  doble giro de la cara, una vez alineado",
          note: "Gira SOLO la cara de arriba hasta que el segundo color del pétalo case con su centro (aquí verde con verde). Solo entonces baja esa cara 180° (F2): la arista cae en línea recta a la cruz, en su sitio y bien orientada. Mira cómo baja sin tocar los demás pétalos. Repite con los cuatro.",
          anim: { setup: "F2 R2 B2 L2", moves: "F2", labels: true, ms: 600 },
        },
        {
          name: "3 · Si una arista está atrapada en el medio",
          alg: "un giro de esa cara la expulsa arriba",
          note: "A veces una arista blanca se queda metida en la franja del medio (aquí, blanco mirando al frente). No la dejes: gira esa cara una vez para sacarla a la capa de arriba y trátala como un pétalo más. Lo mismo si está abajo pero girada: súbela y vuelve a colocarla mirando el color.",
          cube: { alg: "F' U' R U", labels: true, highlight: ["F:1,2", "R:1,0"] },
        },
      ],
      done: {
        name: "Cruz blanca terminada",
        note: "Gira el cubo y mira la cara blanca: una cruz blanca con cada brazo casando su color lateral con el centro de al lado. Esa comprobación —que los colores casan— es la prueba de que está bien hecha, no solo de que «hay cruz».",
      },
    },
    {
      id: "esquinas-blancas", title: "Las esquinas blancas",
      goal: "Rellenar las cuatro esquinas de la cara blanca. Cada esquina lleva blanco y otros dos colores, y va al único rincón donde esos dos colores coinciden con los centros vecinos. Aquí razonar es leer hacia dónde mira el blanco.",
      whyLabel: "Cómo razonarlas paso a paso",
      why: [
        "Localiza una esquina con blanco que esté en la capa de ARRIBA. Mira sus otros dos colores: te dicen su rincón (la blanco-verde-roja va al rincón entre las caras verde y roja). Gira solo la cara de arriba hasta dejarla justo ENCIMA de ese rincón. Ya está medio hecho: está sobre su sitio, solo falta meterla bien.",
        "Ahora lo que de verdad importa: lee hacia dónde mira el blanco. Solo hay tres posibilidades y cada una pide una respuesta distinta. Si el blanco mira a la cara de la DERECHA, el gesto es R U R'. Si mira a la del FRENTE, su espejo: F' U' F. ¿Qué hacen? Abren un hueco bajando esa columna, meten la esquina por arriba y vuelven a cerrar; como el blanco entra de cara hacia abajo, la esquina queda encajada con el blanco en su sitio. No es una fórmula mágica: es «abrir, meter, cerrar».",
        "¿Y si el blanco mira hacia ARRIBA? Es el caso pesado: no puede entrar de cara, hay que reorientarlo primero. La forma limpia es R U' R' U2 R U R', que no es magia sino tres tiempos encadenados: R U' R' tumba el blanco para que deje de mirar arriba, U2 recoloca la esquina sobre su hueco (el blanco queda mirando a la derecha) y R U R' la mete como el primer caso. En el fondo es «preparar el caso fácil y aplicarlo». Y si una esquina blanca está atrapada abajo en el rincón equivocado o girada, haz un gesto para sacarla arriba y vuelve a colocarla. Siempre la misma lógica: mira, decide, mete.",
      ],
      cases: [
        {
          name: "Blanco mirando a la derecha", alg: "R U R'",
          note: "La esquina está arriba, sobre su rincón, con el blanco hacia la cara derecha. «Abre, gira, cierra» por la derecha (R U R') y entra de una. Mira la animación: la columna derecha se abre, la esquina entra y se cierra con el blanco abajo.",
          anim: { setup: "R U' R'", moves: "R U R'", labels: true },
        },
        {
          name: "Blanco mirando al frente", alg: "F' U' F",
          note: "El mismo caso en espejo: el blanco mira hacia ti (la cara de delante). Se mete con F' U' F, que es R U R' visto desde el otro lado. Si entiendes uno, entiendes los dos.",
          anim: { setup: "F' U F", moves: "F' U' F", labels: true },
        },
        {
          name: "Blanco mirando arriba", alg: "R U' R' U2 R U R'",
          note: "El caso pesado: el blanco apunta al cielo y no entra de cara. La secuencia lo resuelve en tres tiempos —síguelos en la animación—: «R U' R'» TUMBA el blanco (deja de mirar arriba), «U2» RECOLOCA la esquina sobre su hueco con el blanco hacia la derecha, y «R U R'» la METE. Es, literalmente, preparar el caso fácil y aplicarlo.",
          anim: { setup: "R U' R' U2 R U R'", moves: "R U' R' U2 R U R'", labels: true, ms: 480 },
        },
      ],
      done: {
        name: "¡Primera capa terminada!",
        note: "Cara blanca completa abajo y la primera fila de cada color casando todo alrededor. Fíjate en que cada esquina tiene sus tres colores bien puestos. La base está hecha; lo que queda está todo arriba, a la vista. Vamos con la Capa 2.",
        cube: { alg: "F' U' F U R U R' U'", labels: true },
      },
    },
  ],
};
