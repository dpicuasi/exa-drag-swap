import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { createSwapy, SlotItemMapArray, SwapEndEvent, SwapEvent, SwapStartEvent, Swapy } from 'swapy';

interface Item {
  id: string
  title: string
  className: string
}

interface EventEntry {
  id: number
  kind: 'info' | 'start' | 'swap' | 'end'
  message: string
}

const STORAGE_KEY = 'exa-drag-swap-state';
const BASE_SLOT_ITEM_MAP: SlotItemMapArray = [
  { slot: '1', item: 'a' },
  { slot: '2', item: 'b' },
  { slot: '3', item: 'c' },
  { slot: '4', item: 'd' },
  { slot: '5', item: 'e' },
];
const BASE_ITEMS: Item[] = [
  { id: 'a', title: 'A', className: 'a' },
  { id: 'b', title: 'B', className: 'b' },
  { id: 'c', title: 'C', className: 'c' },
  { id: 'd', title: 'D', className: 'd' },
  { id: 'e', title: 'E', className: 'e' },
];
const ITEM_CLASSES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

@Component({
  selector: 'app-drag-swap-demo',
  standalone: true,
  templateUrl: './drag-swap-demo.component.html',
  styleUrl: './drag-swap-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DragSwapDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  currentOrder = '';
  lastEvent = 'Listo para mover tarjetas';
  eventLog: EventEntry[] = [];

  private items: Item[] = [...BASE_ITEMS];
  private swapy?: Swapy;
  private eventId = 0;

  ngAfterViewInit(): void {
    this.restoreSavedLayout();
    this.initializeSwapy();
    this.updateOrder();
    this.recordEvent('info', 'Tablero cargado');
  }

  ngOnDestroy(): void {
    this.swapy?.destroy();
  }

  resetLayout(): void {
    const resetSlotItemMap = this.items.map((item, index) => ({
      slot: String(index + 1),
      item: item.id,
    }));

    this.moveItemsToSlots(resetSlotItemMap);
    this.saveSlotItemMap(resetSlotItemMap);
    this.initializeSwapy();
    this.updateOrder(resetSlotItemMap);
    this.recordEvent('info', 'Orden actual restablecido');
  }

  clearStoredState(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.items = [...BASE_ITEMS];
    this.removeExtraSlots();
    this.moveItemsToSlots(BASE_SLOT_ITEM_MAP);
    this.initializeSwapy();
    this.updateOrder(BASE_SLOT_ITEM_MAP);
    this.eventLog = [];
    this.recordEvent('info', 'Estado limpiado y tarjetas base restauradas');
  }

  addItem(): void {
    const nextItem = this.createNextItem();
    const nextSlot = String(this.nextSlotNumber());

    this.items = [...this.items, nextItem];
    this.containerRef.nativeElement.appendChild(this.createSlot(nextSlot, nextItem));

    const slotItemMap = this.currentSlotItemMap();
    this.initializeSwapy();
    this.saveSlotItemMap(slotItemMap);
    this.updateOrder(slotItemMap);
    this.recordEvent('info', `Tarjeta ${nextItem.title} agregada en slot ${nextSlot}`);
  }

  removeLastItem(): void {
    if (!this.canRemoveItem) {
      return;
    }

    const itemToRemove = [...this.items]
      .filter((item) => item.id > 'e')
      .sort((first, second) => second.id.localeCompare(first.id))[0];

    if (!itemToRemove) {
      return;
    }

    this.findItem(itemToRemove.id)?.closest<HTMLElement>('[data-swapy-slot]')?.remove();
    this.items = this.items.filter((item) => item.id !== itemToRemove.id);

    const slotItemMap = this.currentSlotItemMap();
    this.initializeSwapy();
    this.saveSlotItemMap(slotItemMap);
    this.updateOrder(slotItemMap);
    this.recordEvent('info', `Tarjeta ${itemToRemove.title} eliminada`);
  }

  get canRemoveItem(): boolean {
    return this.items.some((item) => item.id > 'e');
  }

  private initializeSwapy(): void {
    this.swapy?.destroy();
    this.swapy = createSwapy(this.containerRef.nativeElement, {
      animation: 'spring',
      autoScrollOnDrag: true,
      dragOnHold: false,
      swapMode: 'drop',
    });
    this.swapy.onSwapStart((event) => this.recordSwapStart(event));
    this.swapy.onSwap((event) => this.recordSwap(event));
    this.swapy.onSwapEnd((event) => this.recordSwapEnd(event));
  }

  private restoreSavedLayout(): void {
    const slotItemMap = this.loadSlotItemMap();
    this.ensureItemsForSlotItemMap(slotItemMap);
    this.moveItemsToSlots(slotItemMap);
  }

  private ensureItemsForSlotItemMap(slotItemMap: SlotItemMapArray): void {
    for (const entry of slotItemMap) {
      const item = this.items.find((candidate) => candidate.id === entry.item) ?? this.createSavedItem(entry.item);

      if (!this.findSlot(entry.slot)) {
        this.containerRef.nativeElement.appendChild(this.createSlot(entry.slot, item));
      }
    }
  }

  private createSavedItem(id: string): Item {
    const item = {
      id,
      title: id.toUpperCase(),
      className: this.randomItemClass(),
    };

    this.items = [...this.items, item];
    return item;
  }

  private createNextItem(): Item {
    const maxCode = Math.max(...this.items.map((item) => item.id.charCodeAt(0)));
    const nextId = String.fromCharCode(maxCode + 1);

    return {
      id: nextId,
      title: nextId.toUpperCase(),
      className: this.randomItemClass(),
    };
  }

  private moveItemsToSlots(slotItemMap: SlotItemMapArray): void {
    for (const entry of slotItemMap) {
      const slot = this.findSlot(entry.slot);
      const item = this.findItem(entry.item);

      if (slot && item) {
        slot.appendChild(item);
      }
    }

    this.swapy?.update();
  }

  private removeExtraSlots(): void {
    for (const slot of Array.from(this.containerRef.nativeElement.querySelectorAll<HTMLElement>('[data-swapy-slot]'))) {
      if (Number(slot.dataset['swapySlot']) > BASE_SLOT_ITEM_MAP.length) {
        slot.remove();
      }
    }
  }

  private createSlot(slotId: string, item: Item): HTMLDivElement {
    const slot = document.createElement('div');
    const itemElement = document.createElement('div');
    const title = document.createElement('div');

    slot.className = `slot ${item.className}`;
    slot.dataset['swapySlot'] = slotId;
    itemElement.className = `item ${item.className}`;
    itemElement.dataset['swapyItem'] = item.id;
    title.textContent = item.title;

    itemElement.appendChild(title);
    slot.appendChild(itemElement);

    return slot;
  }

  private randomItemClass(): string {
    return ITEM_CLASSES[Math.floor(Math.random() * ITEM_CLASSES.length)];
  }

  private currentSlotItemMap(): SlotItemMapArray {
    return Array.from(
      this.containerRef.nativeElement.querySelectorAll<HTMLElement>('[data-swapy-slot]')
    )
      .map((slot) => ({
        slot: slot.dataset['swapySlot'] ?? '',
        item: slot.firstElementChild instanceof HTMLElement
          ? slot.firstElementChild.dataset['swapyItem'] ?? ''
          : '',
      }))
      .filter((entry) => entry.slot && entry.item);
  }

  private updateOrder(slotItemMap = this.swapy?.slotItemMap().asArray ?? BASE_SLOT_ITEM_MAP): void {
    const orderedTitles = [...slotItemMap]
      .sort((first, second) => Number(first.slot) - Number(second.slot))
      .map((entry) => this.items.find((item) => item.id === entry.item)?.title)
      .filter((title): title is string => Boolean(title));

    this.currentOrder = orderedTitles.join(' - ');
  }

  private loadSlotItemMap(): SlotItemMapArray {
    const savedSlotItemMap = localStorage.getItem(STORAGE_KEY);

    if (!savedSlotItemMap) {
      return BASE_SLOT_ITEM_MAP;
    }

    try {
      return this.sanitizeSlotItemMap(JSON.parse(savedSlotItemMap));
    } catch {
      return BASE_SLOT_ITEM_MAP;
    }
  }

  private saveSlotItemMap(slotItemMap: SlotItemMapArray): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slotItemMap));
  }

  private sanitizeSlotItemMap(value: unknown): SlotItemMapArray {
    if (!Array.isArray(value)) {
      return BASE_SLOT_ITEM_MAP;
    }

    const slotItemMap = value.filter((entry): entry is { slot: string; item: string } => (
      typeof entry === 'object' &&
      entry !== null &&
      typeof entry.slot === 'string' &&
      typeof entry.item === 'string'
    ));

    const slots = new Set(slotItemMap.map((entry) => entry.slot));
    const items = new Set(slotItemMap.map((entry) => entry.item));

    return slotItemMap.length > 0 &&
      slots.size === slotItemMap.length &&
      items.size === slotItemMap.length
      ? slotItemMap
      : BASE_SLOT_ITEM_MAP;
  }

  private recordSwapStart(event: SwapStartEvent): void {
    this.recordEvent(
      'start',
      `Inicio: ${this.label(event.draggingItem)} desde slot ${event.fromSlot}`
    );
  }

  private recordSwap(event: SwapEvent): void {
    this.recordEvent(
      'swap',
      `${this.label(event.draggingItem)} cambió con ${this.label(event.swappedWithItem)} (${event.fromSlot} ↔ ${event.toSlot})`
    );
  }

  private recordSwapEnd(event: SwapEndEvent): void {
    this.updateOrder(event.slotItemMap.asArray);
    this.saveSlotItemMap(event.slotItemMap.asArray);
    this.recordEvent(
      'end',
      event.hasChanged
        ? `Fin: orden actualizado a ${this.currentOrder}`
        : 'Fin: no hubo cambios'
    );
  }

  private recordEvent(kind: EventEntry['kind'], message: string): void {
    this.lastEvent = message;
    this.eventLog = [
      {
        id: ++this.eventId,
        kind,
        message,
      },
      ...this.eventLog,
    ].slice(0, 6);
  }

  private label(itemId: string): string {
    return itemId.toUpperCase();
  }

  private nextSlotNumber(): number {
    return Math.max(
      BASE_SLOT_ITEM_MAP.length,
      ...this.currentSlotItemMap().map((entry) => Number(entry.slot))
    ) + 1;
  }

  private findSlot(slotId: string): HTMLElement | null {
    return this.containerRef.nativeElement.querySelector(`[data-swapy-slot="${slotId}"]`);
  }

  private findItem(itemId: string): HTMLElement | null {
    return this.containerRef.nativeElement.querySelector(`[data-swapy-item="${itemId}"]`);
  }
}
