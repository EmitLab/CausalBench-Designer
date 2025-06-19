import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-model-view',
  templateUrl: './model-view.component.html',
  styleUrls: ['./model-view.component.scss']
})
export class ModelViewComponent {
  @Input() models: any[] = [];
  @Input() loading: boolean = false;
  @Output() itemSelected = new EventEmitter<any>();

  onItemClick(item: any) {
    this.itemSelected.emit(item);
  }

  getDisplayName(model: any): string {
    if (model.data && model.data.modl_id) {
      // Item has been configured with data
      if (model.data.modl_version_info_list && model.data.modl_version_info_list.length > 0) {
        return model.data.modl_version_info_list[0].modl.modl_name || 'Unknown Model';
      }
      return 'Configured Model';
    } else {
      // New item without data
      return 'New Model';
    }
  }
} 