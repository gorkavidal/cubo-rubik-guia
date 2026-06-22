/* ===========================================================================
   CAPA 1 · PRIMERA CAPA (cara blanca) — método de la MARGARITA
   El más fácil para empezar: no hay que voltear el cubo ni reconocer casos.
   Se sostiene SIEMPRE con el amarillo arriba (igual que en las capas 2 y 3).
   Diagramas con colores plenos y formato antes → después, generados por el
   motor y verificados.
   =========================================================================== */

export const LAYER1 = {
  id: "capa-1",
  title: "Capa 1 · La cara blanca",
  short: "Capa 1",
  intro: "Empezamos por la base. El método de la margarita es el más sencillo para alguien que acaba de coger el cubo: no hay algoritmos raros ni que dar la vuelta al cubo. Sostén el cubo con el centro AMARILLO mirando arriba y déjalo así toda la capa.",
  idea: "Truco mental: el blanco va abajo y el amarillo arriba (son caras opuestas). En vez de pelear con la cara de abajo, que no ves, juntamos primero las cuatro aristas blancas ARRIBA formando una flor (la «margarita») y luego las dejamos caer a su sitio. Solo hay que mirar colores; nada de memorizar.",
  steps: [
    {
      id: "cruz-blanca", title: "La cruz blanca (margarita)",
      goal: "Formar una cruz blanca en la cara de abajo, con cada arista casando su segundo color con el centro de su cara. Lo conseguimos en dos tiempos: primero una flor blanca arriba, y luego bajamos cada pétalo.",
      why: "Con el amarillo arriba, el centro de abajo es blanco. Una «margarita» es el centro amarillo de arriba rodeado de cuatro aristas blancas (los pétalos): es muy fácil de montar porque solo buscas aristas que tengan blanco y las subes arriba, sin pensar en el otro color. Una vez tienes un pétalo, lo giras (moviendo solo la cara de arriba) hasta que su otro color quede pegado al centro de su misma cara; entonces lo bajas con un giro doble de esa cara y cae justo en su sitio de la cruz, sin estropear los demás pétalos. Repites con los cuatro. El giro doble es la clave: al girar 180° esa cara, el pétalo pasa de arriba a abajo en línea recta.",
      cases: [
        {
          name: "1 · Monta la margarita",
          note: "Centro amarillo arriba y cuatro pétalos blancos alrededor (las aristas con blanco, sin importar su otro color). Ve subiéndolas a la cara de arriba moviendo las caras laterales hasta tener los cuatro pétalos.",
          cube: { alg: "F2 R2 B2 L2", labels: true, highlight: ["U:0,1", "U:1,0", "U:1,2", "U:2,1"] },
        },
        {
          name: "2 · Alinea y baja cada pétalo",
          alg: "F2  (giro doble de la cara de delante)",
          note: "Coge un pétalo y gira SOLO la cara de arriba hasta que su color de delante coincida con el centro de delante (aquí, verde con verde). Cuando casan, baja la cara dos veces (F2): la arista cae a la cruz, abajo, perfectamente colocada. Repite con los cuatro pétalos.",
          beforeAfter: {
            move: "F2",
            before: { alg: "F2 R2 B2 L2", labels: true, highlight: ["U:2,1", "F:0,1"] },
            after: { alg: "F2 R2 B2 L2 F2", labels: true, highlight: ["F:2,1"] },
          },
        },
      ],
      done: {
        name: "Cruz blanca terminada",
        note: "Debajo tienes una cruz blanca y, alrededor, la primera fila de cada color casa con su centro (verde con verde, rojo con rojo…). Si giras el cubo para mirar la base, verás la cruz blanca perfecta. Ahora, las esquinas.",
      },
    },
    {
      id: "esquinas-blancas", title: "Las esquinas blancas",
      goal: "Rellenar las cuatro esquinas que faltan de la cara blanca. Cada esquina tiene blanco más otros dos colores, y va al único rincón de abajo donde esos dos colores coinciden con los centros vecinos.",
      why: "Busca una esquina que tenga blanco y que esté en la capa de ARRIBA. Gírala (moviendo solo la cara de arriba) hasta dejarla justo encima del rincón de abajo al que pertenece —el rincón entre sus dos colores—. Ahora baja y sube ese rincón repitiendo un gesto sencillo: «abre, gira arriba, cierra» (R U R' U' por ese lado). Cada repetición asoma la esquina y la vuelve a guardar; en una, tres o cinco vueltas, la esquina cae con el blanco hacia abajo y encajada. No hay que reconocer nada: repites hasta que el blanco quede abajo. Si una esquina blanca está atrapada abajo pero girada o en el rincón equivocado, haz el gesto una vez para expulsarla arriba y vuelve a colocarla.",
      cases: [
        {
          name: "Coloca la esquina sobre su hueco", alg: "R U R' U'  (repite hasta que entre)",
          note: "La esquina blanca está arriba, encima de su rincón (sus colores de lado, verde y rojo, casan con esas caras). Repite el gesto «abre, gira arriba, cierra» por el lado derecho hasta que el blanco baje. La flecha marca el rincón de destino.",
          cube: { alg: "R U' R'", labels: true, highlight: ["U:2,2", "F:0,2", "R:0,0"], arrows: [{ from: "U:2,2", to: "F:2,2" }] },
        },
      ],
      done: {
        name: "¡Primera capa terminada!",
        note: "Cara blanca completa abajo y la primera fila de cada color casando alrededor. La base está lista. Lo que queda —la franja del medio y la capa amarilla— está todo arriba, donde se ve. A por la Capa 2.",
        cube: { alg: "F' U' F U R U R' U'", labels: true },
      },
    },
  ],
};
