import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dataset-item',
  template: '<div>Dataset Item Component</div>'
})
export class DatasetItemComponent {
  @Input() data: any;
  @Output() selected = new EventEmitter<any>();
} 