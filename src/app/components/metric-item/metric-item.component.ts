import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-metric-item',
  template: '<div>Metric Item Component</div>'
})
export class MetricItemComponent {
  @Input() data: any;
  @Output() selected = new EventEmitter<any>();
} 