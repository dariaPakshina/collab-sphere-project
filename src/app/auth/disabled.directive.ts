import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDisabled]',
  standalone: true,
})
export class DisabledDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.color = 'grey';
    el.nativeElement.style.cursor = 'not-allowed';
  }
}
