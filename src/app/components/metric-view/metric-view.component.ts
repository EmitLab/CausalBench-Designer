import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-metric-view',
  templateUrl: './metric-view.component.html',
  styleUrls: ['./metric-view.component.scss']
})
export class MetricViewComponent {
  @Input() metrics: any[] = [];
  @Input() loading: boolean = false;
  @Output() itemSelected = new EventEmitter<any>();

  onItemClick(item: any) {
    this.itemSelected.emit(item);
  }

  getDisplayName(metric: any): string {
    if (metric.data && metric.data.metric_id) {
      // Item has been configured with data
      if (metric.data.metric_version_info_list && metric.data.metric_version_info_list.length > 0) {
        return metric.data.metric_version_info_list[0].metric.metric_name || 'Unknown Metric';
      }
      return 'Configured Metric';
    } else {
      // New item without data
      return 'New Metric';
    }
  }
} 