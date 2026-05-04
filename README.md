# exa-drag-swap

Demo en Angular 20 para montar una interfaz de drag-to-swap con [Swapy](https://www.npmjs.com/package/swapy).

## Demo

La versión publicada vive en GitHub Pages:

https://dpicuasi.github.io/exa-drag-swap/

## Qué incluye

- Tablero base con tarjetas A-E.
- Soporte para arrastrar desde cualquier parte de la tarjeta.
- Reset del orden actual.
- Limpieza del estado guardado.
- Agregar y quitar tarjetas dinámicamente.
- Historial de eventos de Swapy.
- Persistencia del layout en `localStorage`.

## Desarrollo local

```bash
npm install
npm start -- --host 0.0.0.0
```

Abre:

```text
http://localhost:4200/
```

## Deploy a GitHub Pages

```bash
npm run deploy
```

El script compila con `--base-href=/exa-drag-swap/` y publica el contenido de `dist/exa-drag-swap/browser` en la rama `gh-pages`.

## Estructura

- `src/app/app.component.*`: portada y snippet de uso.
- `src/app/drag-swap-demo.component.*`: demo interactiva.
- `src/styles.scss`: estilos globales.

## Uso básico

```ts
import { createSwapy } from 'swapy';

const swapy = createSwapy(containerElement, {
  animation: 'spring',
  autoScrollOnDrag: true,
  dragOnHold: false,
  swapMode: 'drop',
});

swapy.onSwapEnd(({ slotItemMap }) => {
  console.log(slotItemMap.asArray);
});
```
