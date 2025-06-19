import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-model-item',
  template: '<div>Model Item Component</div>'
})
export class ModelItemComponent {
  @Input() data: any;
  @Output() selected = new EventEmitter<any>();
} 