# Cubo de Rubik · Guía visual capa a capa

Guía interactiva para resolver el cubo de Rubik **de abajo hacia arriba, capa por capa**, del método más sencillo al de velocidad (CFOP). No es una lista de algoritmos a memorizar: cada paso explica **qué le hace al cubo** y **por qué funciona**.

Lo que la hace distinta: **todos los diagramas son estados reales de un cubo**, generados por un motor geométrico propio (rotaciones por matriz), no dibujos aproximados. Cada caso de la última capa es el cubo tras aplicar el inverso de su algoritmo; cada cubo en perspectiva de las dos primeras capas se calcula con el mismo motor.

## Contenido

- **Capa 1 · La cara blanca** — enseñada de forma razonada: primero a *leer* el cubo (centros, piezas, posición vs orientación), luego la cruz por el método de la margarita y las esquinas según hacia dónde mira el blanco. Con **cubos animados** que muestran cada gesto en movimiento.
- **Capa 2 · La franja del medio** — las 4 aristas del medio con los dos algoritmos espejo (derecha / izquierda).
- **Capa 3 · La última capa (amarilla)** — tres caminos:
  - **Simplificada** — pocos algoritmos muy repetibles (con dos variantes en la cruz).
  - **Alternativa** — orienta las esquinas al final con el truco `R' D' R D`.
  - **Optimizada (CFOP)** — 2-look OLL + las 21 PLL, leyendo faros y barras de un vistazo.

## Ejecutar en local

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install      # instala dependencias (sólo la primera vez)
npm run dev      # servidor de desarrollo → http://localhost:5173
```

Para previsualizar la versión de producción:

```bash
npm run build    # genera la carpeta dist/
npm run preview  # sirve dist/ → http://localhost:4173
```

## Verificar el motor del cubo

El motor está cubierto por tests que comprueban estructura, inversas de todos los algoritmos y la geometría de la proyección:

```bash
npm run test:engine          # invariantes del cubo + inversas de todos los algoritmos
node scripts/iso.test.mjs    # geometría de la proyección isométrica
```

## Desplegar en Vercel

El proyecto es una aplicación Vite estándar; Vercel la detecta automáticamente.

**Opción A — desde la web (la más sencilla):**

1. Sube este repositorio a GitHub (ver abajo).
2. Entra en [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio.
3. Vercel detecta **Vite** solo. Deja los valores por defecto:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**. En un minuto tendrás una URL pública para compartir.

**Opción B — desde la terminal:**

```bash
npm i -g vercel
vercel           # primer despliegue (preview)
vercel --prod    # despliegue de producción
```

## Subir a GitHub (repositorio privado)

```bash
git init
git add .
git commit -m "Guía visual del cubo de Rubik"
gh repo create cubo-rubik-guia --private --source . --push
```

(O crea el repo a mano en GitHub y haz `git remote add origin …` + `git push`.)

## Estructura

```
index.html              punto de entrada
src/
  main.jsx              arranque de React
  App.jsx               navegación por capas, métodos y pasos
  styles.css            estilos globales
  lib/
    cubeEngine.js        motor geométrico del cubo + lectura de caras
    isoProjection.js     proyección isométrica (funciones puras)
    theme.js             paleta y tipografías
  components/
    CubeView.jsx         visor del cubo en perspectiva (capas 1 y 2)
    Diagram.jsx          diagrama en planta de la última capa (capa 3)
    AlgoCard.jsx         tarjeta de caso/algoritmo
    Collapsible.jsx      secciones plegables
    Legends.jsx          «cómo leer» los diagramas y la notación
  content/
    layer1.js            Capa 1 (cara blanca)
    layer2.js            Capa 2 (franja del medio)
    layer3.js            Capa 3 (Simplificada / Alternativa / Optimizada)
    diagrams.js          estados y trazas de la última capa
    index.js             ensamblado de la navegación
scripts/                 tests del motor y utilidades de verificación
```

## Créditos

- Algoritmos PLL según el catálogo de Feliks Zemdegs (cubeskills); 2-look OLL del repertorio estándar de speedcubing.
- Capas 1 y 2 por el método principiante clásico.
- Motor del cubo, diagramas y proyección: propios.

## Licencia

Uso personal y educativo.
