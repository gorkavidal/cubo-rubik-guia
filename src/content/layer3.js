/* ===========================================================================
   CAPA 3 · ÚLTIMA CAPA (cara amarilla)
   Dos métodos:
     · SENCILLO   — método de principiante oficial, sin reconocer casos.
     · OPTIMIZADO — CFOP en dos miradas (2-look OLL + PLL completa).
   Algoritmos verificados con el motor del cubo.
   =========================================================================== */
import { CROSS, TRACE_LINE, TRACE_L, TRACE_CORNERS_POS } from "./diagrams.js";

/* --------------------------------------------------------------------------
   MÉTODO SENCILLO
   Cruz amarilla → colocar esquinas (posición) → orientar esquinas (R' D' R D,
   de una en una) → colocar aristas. No hay que reconocer ningún caso.
   -------------------------------------------------------------------------- */
export const SENCILLO = {
  intro: "El método de principiante de toda la vida (el que enseñan Rubik's y ruwix). No hace falta reconocer casos ni memorizar tablas: cada paso es «coloca una pieza en su sitio de referencia y aplica un gesto corto; repite». Con cuatro gestos resuelves la última capa entera.",
  steps: [
    {
      id: "cruz", title: "Cruz amarilla",
      goal: "Que las 4 aristas de arriba enseñen su amarillo al cielo. En qué hueco esté cada una da igual de momento: aquí sólo peleamos la orientación.",
      why: "Orientación pura: cada arista es un bit (amarillo arriba o de lado) y van de dos en dos por paridad, así que sólo hay cuatro siluetas: punto, L, línea y cruz. La gracia es mirar qué hace el algoritmo pieza a pieza, no como un vago «voltea aristas». F R U R' U' F' deja la arista izquierda fija y rota las otras tres en ciclo —FRENTE → DERECHA → ATRÁS → FRENTE— volteando exactamente las dos que pasan por derecha y frente. En una línea horizontal las aristas malas son justo frente y atrás: el ciclo las voltea y quedan amarillas arriba. El algoritmo de la L, F U R U' R' F', es el gemelo con el ciclo al revés, que voltea el par contrario.",
      cases: [
        { name: "Punto", alg: "F R U R' U' F'", note: "Las cuatro aristas esconden su amarillo de lado. Es simétrico: un pase lo deja en L. Luego cierra con el algoritmo de esa forma.", dia: CROSS.punto },
        { name: "Forma de L", alg: "F U R U' R' F'", note: "Coloca las dos aristas amarillas atrás e izquierda (las 9 y las 12 del reloj) y cierra la cruz de una vez.", dia: CROSS.ele, trace: TRACE_L },
        { name: "Línea", alg: "F R U R' U' F'", note: "Ponla horizontal —amarillas a izquierda y derecha— y un pase cierra la cruz.", dia: CROSS.linea, trace: TRACE_LINE },
      ],
      done: { name: "Cruz hecha", note: "Cuatro aristas amarillas arriba. Aún pueden estar en el hueco equivocado: eso se arregla en el último paso.", dia: CROSS.cruz },
    },
    {
      id: "colocar-esquinas", title: "Colocar las esquinas",
      goal: "Llevar cada esquina a su rincón correcto. Aquí sólo importa la POSICIÓN, no cómo esté girada: el giro lo arreglamos en el paso siguiente.",
      why: "U R U' L' U R' U' L cicla tres esquinas de sitio —atrás-izquierda → frente-izquierda → atrás-derecha → atrás-izquierda— y deja fija la de frente-derecha (comprobado: conserva las dos capas de abajo y no toca aristas). De paso las tuerce, pero da igual, porque las orientaremos después. Ese es el truco de dejar la orientación para el final: el algoritmo de colocar puede ser corto precisamente porque no tiene que respetar el giro.",
      cases: [
        { name: "Ciclo de 3 esquinas", alg: "U R U' L' U R' U' L", note: "No mires cómo están giradas, sólo si cada esquina tiene los tres colores correctos para ese rincón. Si una ya encaja, ponla en frente-derecha como ancla y aplica; repite. Si ninguna encaja, un pase coloca al menos una.", dia: { alg: "U R U' L' U R' U' L", mode: "pll" }, trace: TRACE_CORNERS_POS },
      ],
    },
    {
      id: "orientar-esquinas", title: "Orientar las esquinas",
      goal: "Girar cada esquina en su sitio hasta que las cuatro muestren amarillo arriba. Las esquinas ya están colocadas: no las saques de su rincón, sólo gíralas. Es el paso que más asusta y el más fácil: no hay que reconocer NADA.",
      whyLabel: "El truco: una esquina cada vez",
      why: [
        "Un solo gesto, R' D' R D, repetido. Hace algo muy concreto: saca la esquina de delante-arriba-derecha hacia abajo, la gira un tercio y la vuelve a meter. Repetido, gira ESA esquina en su sitio sin tocar las de arriba ya hechas (porque no mueves la cara de arriba mientras tanto).",
        "El procedimiento, infalible: sostén el cubo con el amarillo arriba y NO lo gires. Pon una esquina que aún no tenga amarillo arriba en la posición de delante-derecha. Repite R' D' R D hasta que esa esquina muestre amarillo arriba: dos veces si su amarillo mira a la derecha, cuatro si mira al frente. Parecerá que destrozas el cubo —es normal, se recompone solo—.",
        "Cuando esa esquina ya esté amarilla arriba, gira SÓLO la cara de arriba (una U) para traer la siguiente esquina mal a delante-derecha, y repite. Nunca gires el cubo entero. Cuando las cuatro miren arriba, la base habrá vuelto a su sitio (en total son siempre 6 o 12 repeticiones) y una última U alinea la capa. Funciona siempre porque la suma de los giros de las cuatro esquinas es múltiplo de 3: la cuenta cierra sola.",
      ],
      cases: [
        {
          name: "El gesto: R' D' R D", alg: "R' D' R D",
          note: "Mira qué hace una sola pasada: baja la esquina de delante-derecha, la gira y la sube. Repítelo 2 veces (amarillo a la derecha) o 4 (amarillo al frente) sobre cada esquina mal, girando sólo U entre una y otra.",
          anim: { setup: "D' R' D R", moves: "R' D' R D", labels: true, ms: 520 },
        },
      ],
      done: { name: "Cara amarilla completa", note: "Las cuatro esquinas amarillas arriba y las dos primeras capas otra vez intactas. Sólo queda colocar las aristas.", dia: CROSS.cruz },
    },
    {
      id: "colocar-aristas", title: "Colocar las aristas",
      goal: "El último empujón: cada arista a su hueco. Mismo juego que con las esquinas. Cuando cuadran, el cubo está resuelto.",
      why: "Ua y Ub son tres-ciclos de aristas, espejo el uno del otro: uno las rota en un sentido, el otro en el opuesto. Por la misma ley de paridad, las aristas se mueven de tres en tres. Si una cara ya tiene su arista correcta (verás su centro y su arista del mismo color), déjala atrás como ancla y aplica el ciclo que empuje las otras tres a su sitio.",
      cases: [
        { name: "Ua", alg: "R U' R U R U R U' R' U' R2", note: "Tres-ciclo en un sentido. Coloca la arista ya resuelta atrás.", dia: { alg: "R U' R U R U R U' R' U' R2", mode: "pll" } },
        { name: "Ub", alg: "R2 U R U R' U' R' U' R' U R'", note: "El espejo de Ua (sentido opuesto). Eliges uno u otro según hacia dónde deban girar las tres aristas.", dia: { alg: "R2 U R U R' U' R' U' R' U R'", mode: "pll" } },
      ],
    },
  ],
};

/* --------------------------------------------------------------------------
   MÉTODO OPTIMIZADO (CFOP en dos miradas)
   -------------------------------------------------------------------------- */
export const OPT = {
  intro: "Método de velocidad (CFOP). Las dos fases son las mismas —orientar y colocar— pero dejas de iterar a ciegas: lees el caso de un vistazo y lo resuelves de un solo tirón. Aquí los costados del diagrama son tu instrumento de lectura.",
  steps: [
    {
      id: "oll-aristas", title: "OLL · Aristas (cruz)",
      goal: "Orientar las aristas de arriba. Mismo objetivo y mismo algoritmo que en el método sencillo.",
      why: "Orientación pura otra vez, cada forma con su cierre directo: F R U R' U' F' para la línea, F U R U' R' F' para la L. Se diferencian sólo en el orden de las dos primeras letras (U R en vez de R U), lo que invierte el ciclo de aristas y voltea el par opuesto. El punto, simétrico, necesita un pase para volverse línea o L; el amplio f R U R' U' f' lo lleva directo a línea.",
      cases: [
        { name: "Punto", alg: "f R U R' U' f'", note: "El amplio lo lleva directo a línea; el normal F R U R' U' F', a L. Luego cierra con su algoritmo.", dia: CROSS.punto },
        { name: "L", alg: "F U R U' R' F'", note: "Amarillas atrás e izquierda: cierra la cruz de una vez.", dia: CROSS.ele, trace: TRACE_L },
        { name: "Línea", alg: "F R U R' U' F'", note: "Horizontal (amarillas izquierda-derecha): un pase cierra la cruz.", dia: CROSS.linea, trace: TRACE_LINE },
      ],
    },
    {
      id: "oll-esquinas", title: "OLL · Esquinas (7 casos)",
      goal: "Orientar las esquinas en un solo pase reconociendo el patrón. Completa la cara amarilla. (En el método sencillo esto se hace «a lo bestia» con R' D' R D; aquí se reconoce y se resuelve de una.)",
      why: "Estos son los 7 patrones de orientación de esquinas que existen (descontando giros de U, que no cambian el caso). Para leerlos, mira dos cosas: cuántas esquinas ya tienen amarillo arriba y hacia dónde apuntan los amarillos escondidos —los tabs amarillos del diagrama te lo dicen sin girar el cubo en la mano—. Sune y Antisune (1 esquina, forma de pez) son los habituales; H y Pi no tienen ninguna orientada; faros, T y pajarita tienen dos. Cada silueta, su algoritmo.",
      grid: true,
      cases: [
        { name: "Sune", alg: "R U R' U R U2 R'", note: "1 orientada (pez).", dia: { alg: "R U R' U R U2 R'", mode: "oll" } },
        { name: "Antisune", alg: "R U2 R' U' R U' R'", note: "1 orientada (pez espejo).", dia: { alg: "R U2 R' U' R U' R'", mode: "oll" } },
        { name: "H / Doble Sune", alg: "R U R' U R U' R' U R U2 R'", note: "0 orientadas, amarillos en línea.", dia: { alg: "R U R' U R U' R' U R U2 R'", mode: "oll" } },
        { name: "Pi", alg: "R U2 R2 U' R2 U' R2 U2 R", note: "0 orientadas, doble par.", dia: { alg: "R U2 R2 U' R2 U' R2 U2 R", mode: "oll" } },
        { name: "Headlights (U)", alg: "R2 D R' U2 R D' R' U2 R'", note: "2 adyacentes (faros).", dia: { alg: "R2 D R' U2 R D' R' U2 R'", mode: "oll" } },
        { name: "T / Chameleon", alg: "r U R' U' r' F R F'", note: "2 adyacentes (faros + barra).", dia: { alg: "r U R' U' r' F R F'", mode: "oll" } },
        { name: "Bowtie (L)", alg: "F' r U R' U' r' F R", note: "2 en diagonal (pajarita).", dia: { alg: "F' r U R' U' r' F R", mode: "oll" } },
      ],
    },
    {
      id: "pll", title: "PLL · Permutación completa (21)",
      goal: "Colocar todas las piezas de una vez. Tras alinear la capa con una U, el cubo queda resuelto.",
      why: "Estos son los 21 modos de tener la cara amarilla hecha pero las piezas descolocadas. Y aquí los costados lo son todo: dos pegatinas iguales mirando al mismo lado son unos faros (te los marco con una ceja) y significan que esas dos esquinas forman un bloque que no se separa; tres iguales seguidas son una barra (te la marco con un recuadro) y significan que ese lado ya está resuelto. Localizar faros y barras te dice qué está montado y, por descarte, qué se mueve. No memorizas 21 dibujos abstractos: lees dos o tres colores y el caso se delata. Catálogo de Feliks Zemdegs.",
      grid: true,
      groups: [
        {
          label: "Solo aristas",
          blurb: "Las 4 esquinas ya están en su sitio: por eso ves faros en los cuatro costados. Sólo bailan las aristas — Ua/Ub son ciclos de tres, Z cruza los dos pares vecinos y H intercambia los dos pares opuestos.",
          cases: [
            { name: "Ua", alg: "R U' R U R U R U' R' U' R2", dia: { alg: "R U' R U R U R U' R' U' R2", mode: "pll" } },
            { name: "Ub", alg: "R2 U R U R' U' R' U' R' U R'", dia: { alg: "R2 U R U R' U' R' U' R' U R'", mode: "pll" } },
            { name: "Z", alg: "M2 U M2 U M' U2 M2 U2 M'", dia: { alg: "M2 U M2 U M' U2 M2 U2 M'", mode: "pll" } },
            { name: "H", alg: "M2 U M2 U2 M2 U M2", dia: { alg: "M2 U M2 U2 M2 U M2", mode: "pll" } },
          ],
        },
        {
          label: "Solo esquinas",
          blurb: "Ahora las aristas ya están y giran las esquinas. Aa y Ab son tres-ciclos de esquinas —el par que no se mueve aparece como unos faros—; E intercambia las dos diagonales y no deja ningún bloque que leer.",
          cases: [
            { name: "Aa", alg: "x R' U R' D2 R U' R' D2 R2 x'", dia: { alg: "x R' U R' D2 R U' R' D2 R2 x'", mode: "pll" } },
            { name: "Ab", alg: "x R2 D2 R U R' D2 R U' R x'", dia: { alg: "x R2 D2 R U R' D2 R U' R x'", mode: "pll" } },
            { name: "E", alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x", dia: { alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x", mode: "pll" } },
          ],
        },
        {
          label: "Adyacentes (J · T · R · F)",
          blurb: "Intercambian un par de piezas vecinas. Busca el único costado con barra o faros: ese par ya está montado y hace de ancla; el algoritmo recoloca el resto.",
          cases: [
            { name: "Ja", alg: "R' U L' U2 R U' R' U2 R L", dia: { alg: "R' U L' U2 R U' R' U2 R L", mode: "pll" } },
            { name: "Jb", alg: "R U R' F' R U R' U' R' F R2 U' R'", dia: { alg: "R U R' F' R U R' U' R' F R2 U' R'", mode: "pll" } },
            { name: "T", alg: "R U R' U' R' F R2 U' R' U' R U R' F'", dia: { alg: "R U R' U' R' F R2 U' R' U' R U R' F'", mode: "pll" } },
            { name: "Ra", alg: "R U' R' U' R U R D R' U' R D' R' U2 R'", dia: { alg: "R U' R' U' R U R D R' U' R D' R' U2 R'", mode: "pll" } },
            { name: "Rb", alg: "R' U2 R U2 R' F R U R' U' R' F' R2", dia: { alg: "R' U2 R U2 R' F R U R' U' R' F' R2", mode: "pll" } },
            { name: "F", alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", dia: { alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", mode: "pll" } },
          ],
        },
        {
          label: "Tipo G",
          blurb: "Los más resbaladizos: mueven una esquina y una arista en tándem (un triciclo cruzado). Se reconocen por un único par de faros; la dificultad está en orientar bien ese par antes de ejecutar.",
          cases: [
            { name: "Ga", alg: "R2 U R' U R' U' R U' R2 D U' R' U R D'", dia: { alg: "R2 U R' U R' U' R U' R2 D U' R' U R D'", mode: "pll" } },
            { name: "Gb", alg: "F' U' F R2 u R' U R U' R u' R2", dia: { alg: "F' U' F R2 u R' U R U' R u' R2", mode: "pll" } },
            { name: "Gc", alg: "R2 U' R U' R U R' U R2 D' U R U' R' D", dia: { alg: "R2 U' R U' R U R' U R2 D' U R U' R' D", mode: "pll" } },
            { name: "Gd", alg: "D' R U R' U' D R2 U' R U' R' U R' U R2", dia: { alg: "D' R U R' U' D R2 U' R U' R' U R' U R2", mode: "pll" } },
          ],
        },
        {
          label: "Diagonales y N",
          blurb: "Intercambian piezas opuestas en diagonal. Aquí no hay faros ni barras por ningún lado —ningún costado tiene dos iguales— y esa ausencia total es justamente la firma del caso.",
          cases: [
            { name: "V", alg: "R' U R' U' y R' F' R2 U' R' U R' F R F y'", dia: { alg: "R' U R' U' y R' F' R2 U' R' U R' F R F y'", mode: "pll" } },
            { name: "Y", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", dia: { alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", mode: "pll" } },
            { name: "Na", alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", dia: { alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", mode: "pll" } },
            { name: "Nb", alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R", dia: { alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R", mode: "pll" } },
          ],
        },
      ],
    },
  ],
};
