import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss']
})
export class DatasetViewComponent {
  @Input() datasets: any[] = [];
  @Input() loading: boolean = false;
  @Output() itemSelected = new EventEmitter<any>();

  onItemClick(item: any) {
    this.itemSelected.emit(item);
  }

  getDisplayName(dataset: any): string {
    if (dataset.data && dataset.data.dataset_id) {
      // Item has been configured with data
      if (dataset.data.dataset_version_info_list && dataset.data.dataset_version_info_list.length > 0) {
        return dataset.data.dataset_version_info_list[0].dataset.dataset_name || 'Unknown Dataset';
      }
      return 'Configured Dataset';
    } else {
      // New item without data
      return 'New Dataset';
    }
  }
} 