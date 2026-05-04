import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { createSwapy, SlotItemMapArray, Swapy } from 'swapy';

interface Item {
  id: string
  title: string
  className: string
}

const STORAGE_KEY = 'exa-drag-swap-state';
const BASE_SLOT_ITEM_MAP: SlotItemMapArray = [
  { slot: '1', item: 'a' },
  { slot: '2', item: 'b' },
  { slot: '3', item: 'c' },
  { slot: '4', item: 'd' },
  { slot: '5', item: 'e' },
];
const ITEM_CLASSES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const INITIAL_ITEMS: Item[] = [
  { id: 'a', title: 'A', className: 'a' },
  { id: 'b', title: 'B', className: 'b' },
  { id: 'c', title: 'C', className: 'c' },
  { id: 'd', title: 'D', className: 'd' },
  { id: 'e', title: 'E', className: 'e' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;
  currentOrder = '';
  private items = [...INITIAL_ITEMS];
  private swapy?: Swapy;

  ngAfterViewInit(): void {
    this.restoreSavedLayout();
    this.initializeSwapy();
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
    this.updateOrder(resetSlotItemMap);
  }

  addItem(): void {
    const maxItemCode = Math.max(...this.items.map((item) => item.id.charCodeAt(0)));
    const nextId = String.fromCharCode(maxItemCode + 1);
    const nextSlot = String(this.items.length + 1);
    const nextItem: Item = {
      id: nextId,
      title: nextId.toUpperCase(),
      className: this.randomItemClass(),
    };

    this.items = [...this.items, nextItem];
    this.containerRef.nativeElement.appendChild(this.createSlot(nextSlot, nextItem));
    const slotItemMap = this.currentSlotItemMap();

    this.initializeSwapy();
    this.saveSlotItemMap(slotItemMap);
    this.updateOrder(slotItemMap);
  }

  removeLastItem(): void {
    if (!this.canRemoveItem) {
      return;
    }

    const itemToRemove = [...this.items].sort((first, second) =>
      second.id.localeCompare(first.id)
    )[0];
    const itemElement = this.findItem(itemToRemove.id);
    const slotElement = itemElement?.closest<HTMLElement>('[data-swapy-slot]');

    itemElement?.remove();
    slotElement?.remove();
    this.items = this.items.filter((item) => item.id !== itemToRemove.id);

    const slotItemMap = this.currentSlotItemMap();
    this.initializeSwapy();
    this.saveSlotItemMap(slotItemMap);
    this.updateOrder(slotItemMap);
  }

  get canRemoveItem(): boolean {
    return this.items.length > INITIAL_ITEMS.length;
  }

  private restoreSavedLayout(): void {
    const savedSlotItemMap = this.loadSlotItemMap();
    this.createMissingSavedItems(savedSlotItemMap);
    this.moveItemsToSlots(savedSlotItemMap);
  }

  private initializeSwapy(): void {
    this.swapy?.destroy();
    this.swapy = createSwapy(this.containerRef.nativeElement, {
      animation: 'spring',
      autoScrollOnDrag: true,
      dragOnHold: false,
      swapMode: 'drop',
    });
    this.updateOrder();
    this.swapy.onSwapEnd((event) => {
      if (event.hasChanged) {
        this.saveSlotItemMap(event.slotItemMap.asArray);
        this.updateOrder(event.slotItemMap.asArray);
      }
    });
  }

  private createMissingSavedItems(slotItemMap: SlotItemMapArray): void {
    for (const entry of slotItemMap) {
      const itemExists = this.items.some((item) => item.id === entry.item);
      const slotExists = this.findSlot(entry.slot);

      if (!itemExists) {
        const nextItem: Item = {
          id: entry.item,
          title: entry.item.toUpperCase(),
          className: this.randomItemClass(),
        };
        this.items = [...this.items, nextItem];
        this.containerRef.nativeElement.appendChild(this.createSlot(entry.slot, nextItem));
      } else if (!slotExists) {
        const item = this.items.find((candidate) => candidate.id === entry.item);

        if (item) {
          this.containerRef.nativeElement.appendChild(this.createSlot(entry.slot, item));
        }
      }
    }
  }

  private moveItemsToSlots(slotItemMap: SlotItemMapArray): void {
    for (const itemConfig of slotItemMap) {
      const slot = this.findSlot(itemConfig.slot);
      const item = this.findItem(itemConfig.item);

      if (slot && item) {
        slot.appendChild(item);
      }
    }

    this.swapy?.update();
  }

  private createSlot(slotId: string, item: Item): HTMLDivElement {
    const slot = document.createElement('div');
    const itemElement = document.createElement('div');
    const title = document.createElement('div');
    const slotReference = this.containerRef.nativeElement.querySelector<HTMLElement>('.slot');
    const itemReference = this.containerRef.nativeElement.querySelector<HTMLElement>('.item');

    slot.className = `slot ${item.className}`;
    slot.dataset['swapySlot'] = slotId;
    itemElement.className = `item ${item.className}`;
    itemElement.dataset['swapyItem'] = item.id;
    title.textContent = item.title;

    this.copyAngularStyleScope(slotReference, slot);
    this.copyAngularStyleScope(itemReference, itemElement);
    this.copyAngularStyleScope(itemReference?.firstElementChild, title);

    itemElement.appendChild(title);
    slot.appendChild(itemElement);

    return slot;
  }

  private randomItemClass(): string {
    return ITEM_CLASSES[Math.floor(Math.random() * ITEM_CLASSES.length)];
  }

  private copyAngularStyleScope(
    source: Element | null | undefined,
    target: HTMLElement
  ): void {
    if (!source) {
      return;
    }

    for (const attribute of Array.from(source.attributes)) {
      if (attribute.name.startsWith('_ngcontent-')) {
        target.setAttribute(attribute.name, '');
      }
    }
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

  private findSlot(slotId: string): HTMLElement | null {
    return this.containerRef.nativeElement.querySelector(`[data-swapy-slot="${slotId}"]`);
  }

  private findItem(itemId: string): HTMLElement | null {
    return this.containerRef.nativeElement.querySelector(`[data-swapy-item="${itemId}"]`);
  }
}
