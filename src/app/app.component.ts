import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { createSwapy, SlotItemMapArray, Swapy, utils } from 'swapy';

interface Item {
  id: string
  title: string
  slot:string
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  items: Item[] = [
    { id: '1', title: '1' , slot:'1'},
    { id: '2', title: '2', slot:'2'},
    { id: '3', title: '3' , slot:'3'},
    { id: '4', title: '4' , slot:'4'},
  ]

  slotItemMap: SlotItemMapArray = utils.initSlotItemMap(this.items, 'id');
  slottedItems: any[] = [];
  swapyRef: Swapy | null = null;
  idCounter = 5;

  constructor() {
    this.slottedItems = utils.toSlottedItems(this.items, 'id', this.slotItemMap);
    console.log('slottedItems', this.slottedItems);
    console.log('slotItemMap', this.slotItemMap);
  }

  ngAfterViewInit(): void {
    const swapy = createSwapy(this.containerRef.nativeElement);
    swapy.onSwap((event) => console.log('event', event));
  }

  updateSlottedItems() {
    this.slottedItems = utils.toSlottedItems(
      this.items,
      'id',
      this.slotItemMap
    )
  }

  addItem() {
    const newItem: Item = { id: `${this.idCounter}`, title: `${this.idCounter}`, slot: `${this.idCounter}` }
    this.items = [...this.items, newItem]
    this.slotItemMap = utils.initSlotItemMap(this.items, 'id')
    this.updateSlottedItems()
    this.idCounter++
  }

  removeItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id)
    this.slotItemMap = utils.initSlotItemMap(this.items, 'id')
    this.updateSlottedItems()
  }

  ngOnDestroy(): void {
    this.swapyRef?.destroy()
  }

  handleKeyDown(event: KeyboardEvent, itemId: string) {
    // Check if the pressed key is Enter  
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement
      const itemId = target.getAttribute('data-item-id')
      if (itemId) {
        this.removeItem(itemId)
      }
    }
  }

  handleAddItemKeyDown(event: KeyboardEvent) {
    // Check if the pressed key is Enter  
    if (event.key === 'Enter') {
      this.addItem()
    }
  }
  
}
