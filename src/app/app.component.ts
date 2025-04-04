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
export class AppComponent implements AfterViewInit {

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  constructor() {
  }

  ngAfterViewInit(): void {
    const swapy = createSwapy(this.containerRef.nativeElement);
    swapy.onSwap((event) => console.log('event', event));
  }

  
}
