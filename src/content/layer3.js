/* ===========================================================================
   CAPA 3 · ÚLTIMA CAPA (cara amarilla)
   Tres métodos: Simplificada, Alternativa (2 variantes en la cruz) y Optimizada (CFOP).
   Contenido y algoritmos verificados con el motor del cubo.
   =========================================================================== */
import { CROSS, TRACE_LINE, TRACE_L, TRACE_CORNERS, TRACE_CORNERS_POS } from "./diagrams.js";

export const SIMPLE = {
  intro: "Método principiante: pocos algoritmos, muy repetibles, pensados para entender qué le hace cada uno al cubo en lugar de memorizar a ciegas.",
  steps: [
    {
      id: "cruz", title: "Cruz amarilla",
      goal: "Que las 4 aristas de arriba enseñen su amarillo al cielo. En qué hueco esté cada una da exactamente igual: aquí sólo peleamos la orientación.",
      why: "Orientación pura: cada arista es un bit (amarillo arriba o de lado) y van de dos en dos por paridad, así que sólo hay punto, L, línea y cruz. La clave para seguirlo es mirar qué hace el algoritmo pieza a pieza, no como un vago «voltea aristas». F R U R' U' F' deja la arista izquierda fija y rota las otras tres en ciclo —FRENTE → DERECHA → ATRÁS → FRENTE— volteando exactamente las dos que llegan a derecha y a frente (lo tienes desglosado en cada caso). Ahí está la gracia: en una línea horizontal las aristas malas son justo FRENTE y ATRÁS; el ciclo las voltea de paso y las deja amarillas arriba, mientras las buenas (la izquierda, fija, y la derecha, que viaja sin voltear) siguen buenas → cruz. El algoritmo de la L, F U R U' R' F', es el gemelo con el ciclo girando al revés: voltea el par contrario, que son las aristas malas de la L. Por eso un solo algoritmo no cierra las dos formas — cada una necesita que los volteos caigan sobre sus dos aristas malas.",
      cases: [
        { name: "Punto", alg: "F R U R' U' F'", note: "Las cuatro aristas esconden su amarillo de lado. Es simétrico, así que el resultado es fijo: un pase lo deja en L (o el amplio f R U R' U' f', en línea). Luego cierra con el algoritmo de esa forma.", dia: CROSS.punto },
        { name: "Forma de L", alg: "F U R U' R' F'", note: "Coloca las dos aristas amarillas atrás e izquierda (las 9 y las 12 del reloj): cierra la cruz de una vez. Sólo cambian las dos primeras letras respecto al de la línea, y eso invierte el ciclo.", dia: CROSS.ele, trace: TRACE_L },
        { name: "Línea", alg: "F R U R' U' F'", note: "Ponla horizontal —aristas amarillas a izquierda y derecha— y un pase cierra la cruz. Las dos malas (frente y atrás) son las que el ciclo voltea.", dia: CROSS.linea, trace: TRACE_LINE },
      ],
      done: { name: "Cruz hecha", note: "Cuatro aristas amarillas arriba. Aún pueden estar en el hueco equivocado: eso se arregla en el paso 4.", dia: CROSS.cruz },
    },
    {
      id: "orientar-esquinas", title: "Orientar las esquinas",
      goal: "Que toda la cara de arriba quede amarilla. Las esquinas no se voltean (un bit), se giran: pueden mirar arriba o estar torcidas un tercio hacia un lado o el otro.",
      why: "Piensa en un contador mod 3 por esquina. Y de nuevo manda una ley de conservación: la suma de los giros de las cuatro esquinas es siempre múltiplo de 3, así que tampoco puedes quedarte con una sola torcida. Sune (R U R' U R U2 R') toma una esquina ya buena como ancla y reparte giro entre las otras tres. Como el total debe cuadrar a cero mod 3, al repetir Sune —recolocando con la cara U entre pase y pase— el reparto se va anulando hasta que las cuatro miran arriba. No estás probando: estás drenando el giro sobrante hasta que la cuenta llega a cero.",
      cases: [
        { name: "Sune", alg: "R U R' U R U2 R'", note: "Coloca una esquina ya amarilla arriba-izquierda mirando a la izquierda y repite hasta que toda la cara sea amarilla.", dia: { alg: "R U R' U R U2 R'", mode: "oll" } },
        { name: "Antisune (atajo)", alg: "R U2 R' U' R U' R'", note: "El espejo del Sune; resuelve el caso simétrico en menos repeticiones.", dia: { alg: "R U2 R' U' R U' R'", mode: "oll" } },
      ],
    },
    {
      id: "permutar-esquinas", title: "Colocar las esquinas",
      goal: "Las esquinas ya son todas amarillas, pero pueden ocupar el hueco equivocado. Hay que llevarlas a su sitio sin torcer ninguna: la cara amarilla no se puede romper.",
      why: "Aquí está justo lo que detectaste: el algoritmo de colocar tiene que conservar la orientación. R' F R' B2 R F' R' B2 R2 es un ciclo de tres esquinas que las cambia de sitio dejando su amarillo arriba (comprobado: la cara superior sigue entera amarilla y ninguna se tuerce). Cicla atrás-izquierda → atrás-derecha → frente-derecha → atrás-izquierda y deja fija la de frente-izquierda. ¿Por qué tres y no «intercambiar dos»? Por paridad: en la última capa no puedes permutar sólo dos esquinas dejando el resto intacto (sería una permutación impar, imposible sin mover también aristas); lo mínimo legal es rotar tres. De hecho esto ya es un PLL sin nombrarlo: el ciclo de esquinas (A-perm). Ojo: U R U' L' U R' U' L, que se ve mucho, NO sirve aquí porque tuerce las esquinas — ése es para colocar antes de orientar, no después.",
      cases: [
        { name: "Ciclo de 3 esquinas (A-perm)", alg: "R' F R' B2 R F' R' B2 R2", note: "Si una esquina ya está bien colocada (sus tres colores casan con los laterales), ponla en frente-izquierda como ancla y aplica: cicla las otras tres sin torcerlas. Si ninguna casa, aplica una vez, aparecerá una correcta, recoloca y repite.", dia: { alg: "R' F R' B2 R F' R' B2 R2", mode: "pll" }, trace: TRACE_CORNERS },
      ],
    },
    {
      id: "permutar-aristas", title: "Colocar las aristas",
      goal: "El último empujón: cada arista a su hueco. Mismo juego que con las esquinas, ahora con las aristas. Cuando cuadran, el cubo está resuelto.",
      why: "Ua y Ub son tres-ciclos de aristas, espejo el uno del otro: uno las rota en un sentido, el otro en el opuesto. Por la misma ley de paridad, las aristas también se mueven de tres en tres. Si una cara ya tiene su arista correcta (verás su centro y su arista del mismo color), la dejas atrás como ancla y aplicas el ciclo que empuje las otras tres hacia su sitio.",
      cases: [
        { name: "Ua", alg: "R U' R U R U R U' R' U' R2", note: "Tres-ciclo en un sentido. Coloca la arista ya resuelta atrás.", dia: { alg: "R U' R U R U R U' R' U' R2", mode: "pll" } },
        { name: "Ub", alg: "R2 U R U R' U' R' U' R' U R'", note: "El espejo de Ua (sentido opuesto). Eliges uno u otro según hacia dónde deban girar las tres aristas.", dia: { alg: "R2 U R U R' U' R' U' R' U R'", mode: "pll" } },
      ],
    },
  ],
};

export const ALT = {
  intro: "Camino alternativo, el más fácil de memorizar a mano: las esquinas se orientan al final con el truco R' D' R D (4 movimientos). A cambio, a media maniobra el cubo parece desordenarse y estos dos algoritmos no se reutilizan en la versión optimizada (los de la simplificada sí). Los pasos 1 y 4 son idénticos a la simplificada.",
  steps: [
    SIMPLE.steps[0],
    {
      id: "alt-colocar-esquinas", title: "Colocar las esquinas",
      goal: "Antes de orientar, lleva cada esquina a su hueco correcto. El giro todavía no importa: aquí sólo cuenta la posición.",
      why: "U R U' L' U R' U' L cicla tres esquinas de posición —atrás-izquierda → frente-izquierda → atrás-derecha → atrás-izquierda— y deja fija la de frente-derecha (comprobado: conserva las dos capas de abajo y no toca aristas). De paso las tuerce, pero da igual: el giro se arregla en el paso siguiente. Eso es lo bueno de orientar al final — el algoritmo de colocar puede ser corto precisamente porque no tiene que respetar la orientación (justo lo que obligaba al A-perm largo en la versión simplificada).",
      cases: [
        { name: "Ciclo de 3 esquinas (posición)", alg: "U R U' L' U R' U' L", note: "No mires cómo están giradas, sólo si cada esquina tiene los tres colores correctos para ese rincón. Si una ya encaja, ponla en frente-derecha como ancla y aplica; repite. Si ninguna encaja, un pase coloca al menos una.", trace: TRACE_CORNERS_POS },
      ],
    },
    {
      id: "alt-orientar-esquinas", title: "Orientar las esquinas",
      goal: "Ahora gira cada esquina en su hueco hasta que todas muestren amarillo arriba, sin sacarlas de su sitio.",
      why: "R' D' R D tiene orden 6 (repetido seis veces, el cubo vuelve a estar igual). Dos repeticiones giran 120° la esquina de delante-derecha —y sólo esa de las de arriba; las otras tres conservan su amarillo arriba, aunque el resto del cubo se revuelva a medias y se recomponga al cerrar. El plan: cubo fijo con amarillo arriba; pon una esquina sin amarillo arriba en delante-derecha; repite R' D' R D hasta que muestre amarillo (2 o 4 veces); gira SÓLO la cara de arriba para traer la siguiente esquina mala a delante-derecha; repite. Cuando las cuatro estén amarillas, una última U alinea y la base vuelve a estar resuelta. Como la suma de los giros es múltiplo de 3, la cuenta siempre cierra.",
      cases: [
        { name: "Truco R' D' R D", alg: "R' D' R D", note: "No hay que reconocer casos: sólo giras cada esquina mala. 2 repeticiones = un tercio de vuelta; 4 = dos tercios. Entre esquina y esquina gira sólo la cara de arriba, nunca el cubo entero." },
      ],
    },
    SIMPLE.steps[3],
  ],
};

export const OPT = {
  intro: "Método de velocidad (CFOP). Las dos fases son las mismas —orientar y colocar— pero dejas de iterar a ciegas: lees el caso de un vistazo y lo resuelves de un solo tirón. Aquí los costados del diagrama son tu instrumento de lectura.",
  steps: [
    {
      id: "oll-aristas", title: "OLL · Aristas (cruz)",
      goal: "Orientar las aristas de arriba. Mismo objetivo y mismo algoritmo que en el método simple.",
      why: "Orientación pura otra vez, cada forma con su cierre directo: F R U R' U' F' para la línea, F U R U' R' F' para la L. Se diferencian sólo en el orden de las dos primeras letras (U R en vez de R U), lo que invierte el ciclo de aristas y voltea el par opuesto — mira la traza de cada caso. El punto, simétrico, necesita un pase para volverse línea o L; el amplio f R U R' U' f' lo lleva directo a línea.",
      cases: [
        { name: "Punto", alg: "f R U R' U' f'", note: "El amplio lo lleva directo a línea; el normal F R U R' U' F', a L. Luego cierra con su algoritmo.", dia: CROSS.punto },
        { name: "L", alg: "F U R U' R' F'", note: "Amarillas atrás e izquierda: cierra la cruz de una vez.", dia: CROSS.ele, trace: TRACE_L },
        { name: "Línea", alg: "F R U R' U' F'", note: "Horizontal (amarillas izquierda-derecha): un pase cierra la cruz.", dia: CROSS.linea, trace: TRACE_LINE },
      ],
    },
    {
      id: "oll-esquinas", title: "OLL · Esquinas (7 casos)",
      goal: "Orientar las esquinas en un solo pase reconociendo el patrón. Completa la cara amarilla.",
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
