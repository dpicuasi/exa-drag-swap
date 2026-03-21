# exa-drag-swap

[![Angular](https://img.shields.io/badge/Angular-20.x-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/exa-drag-swap?style=for-the-badge&color=blue)](https://www.npmjs.com/package/exa-drag-swap)

> Componente de drag-and-drop para Angular con soporte para intercambio de elementos entre contenedores.

---

## 📋 Sobre el Proyecto

**exa-drag-swap** es un componente Angular que permite implementar funcionalidades de arrastrar y soltar (drag-and-drop) de manera sencilla y personalizable. Está diseñado para ser liviano, accesible y fácil de integrar en cualquier aplicación Angular.

### ✨ Características Principales

- ✅ **Soporte para múltiples contenedores** – Arrastra elementos entre diferentes zonas.
- ✅ **Interfaz personalizable** – Estilos CSS modulares y eventos personalizados.
- ✅ **Accesibilidad** – Compatibilidad con lectores de pantalla y navegación por teclado.
- ✅ **Ligero** – Sin dependencias pesadas, solo Angular y RxJS.
- ✅ **TypeScript** – Código tipado y mantenible.
- ✅ **Documentación completa** – Ejemplos y guías de uso.

---

## 🚀 Instalación

```bash
npm install exa-drag-swap
```

---

## 📦 Uso Básico

### 1. Importar el módulo

```typescript
import { DragDropModule } from 'exa-drag-swap';

@NgModule({
  imports: [
    DragDropModule
  ]
})
export class AppModule { }
```

### 2. Usar el componente en tu plantilla

```html
<exa-drag-drop
  [items]="items"
  (drop)="onDrop($event)"
  [placeholder]="'Arrastra aquí'">
</exa-drag-drop>
```

### 3. Manejar eventos en tu componente

```typescript
import { Component } from '@angular/core';
import { DragDropEvent } from 'exa-drag-swap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  items = [
    { id: 1, content: 'Elemento 1' },
    { id: 2, content: 'Elemento 2' },
    { id: 3, content: 'Elemento 3' }
  ];

  onDrop(event: DragDropEvent) {
    console.log('Elemento arrastrado:', event.item);
    console.log('Nuevo orden:', event.items);
  }
}
```

---

## 🎨 Personalización

### Props (Inputs)

| Prop | Tipo | Descripción |
|------|------|-------------|
| `items` | `any[]` | Array de elementos a mostrar |
| `drop` | `EventEmitter<DragDropEvent>` | Evento al soltar un elemento |
| `placeholder` | `string` | Texto mostrado cuando no hay elementos |
| `disabled` | `boolean` | Deshabilita el drag-and-drop |
| `animationDuration` | `number` | Duración de la animación en ms |

### Eventos (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `drop` | `DragDropEvent` | Se dispara al soltar un elemento |
| `dragStart` | `DragStartEvent` | Se dispara al iniciar el arrastre |
| `dragEnd` | `DragEndEvent` | Se dispara al finalizar el arrastre |

---

## 🛠️ Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/exa-drag-swap.git
cd exa-drag-swap

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# Ejecutar pruebas
ng test

# Build de producción
ng build
```

---

## 📁 Estructura del Proyecto

```
exa-drag-swap/
├── src/
│   ├── lib/
│   │   ├── drag-drop/
│   │   │   ├── drag-drop.component.ts
│   │   │   ├── drag-drop.component.html
│   │   │   ├── drag-drop.component.scss
│   │   │   └── drag-drop.module.ts
│   │   └── models/
│   │       ├── drag-drop-event.model.ts
│   │       └── drag-start-event.model.ts
│   └── public-api.ts
├── package.json
├── ng-package.json
├── README.md
└── LICENSE
```

---

## 📈 Roadmap

- [ ] Soporte para arrastrar entre múltiples contenedores
- [ ] Animaciones personalizables con CSS
- [ ] Persistencia de estado (localStorage)
- [ ] Mejora de accesibilidad (ARIA)
- [ ] Soporte para touch devices
- [ ] Internacionalización (i18n)

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

Asegúrate de que tu código pase las pruebas y siga las convenciones de estilo.

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

## 📬 Contacto

- **Autor**: Daniel (desarrollador)
- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **Email**: tu-correo@example.com
- **Proyecto**: [https://github.com/tu-usuario/exa-drag-swap](https://github.com/tu-usuario/exa-drag-swap)

---

## 🙏 Agradecimientos

- [Angular](https://angular.io) – Framework principal (v20.3.18)
- [Swapy](https://www.npmjs.com/package/swapy) – Librería de utilidades
- Comunidad de Angular por sus contribuciones

---

**¡Gracias por usar exa-drag-swap!** 🚀
