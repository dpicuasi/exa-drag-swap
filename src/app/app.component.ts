import { Component } from '@angular/core';
import { DragSwapDemoComponent } from './drag-swap-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DragSwapDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly usageSnippet = `import { createSwapy } from 'swapy';

const swapy = createSwapy(containerElement, {
  animation: 'spring',
  autoScrollOnDrag: true,
  dragOnHold: false,
  swapMode: 'drop',
});

swapy.onSwapEnd(({ slotItemMap }) => {
  console.log(slotItemMap.asArray);
});`;
}
