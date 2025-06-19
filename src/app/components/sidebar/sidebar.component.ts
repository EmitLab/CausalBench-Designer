import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() availableDatasets: any[] = [];
  @Input() availableModels: any[] = [];
  @Input() availableMetrics: any[] = [];
  @Input() currentItem: any = null;
  @Input() currentItemType: 'dataset' | 'model' | 'metric' | null = null;
  @Input() loadingDatasets = false;
  @Input() loadingModels = false;
  @Input() loadingMetrics = false;
  
  @Output() itemSelected = new EventEmitter<any>();
  @Output() addDataset = new EventEmitter<void>();
  @Output() addModel = new EventEmitter<void>();
  @Output() addMetric = new EventEmitter<void>();
  @Output() removeItem = new EventEmitter<void>();
  @Output() exportContext = new EventEmitter<void>();
  @Output() applyItem = new EventEmitter<any>();

  // Query and Information section
  selectedType: 'dataset' | 'model' | 'metric' | null = null;
  selectedId = '';
  selectedVersion = '';
  
  // Information fields
  itemName = '';
  itemDescription = '';
  itemAuthor = '';
  itemVisibility = '';
  itemUrl = '';
  itemTimestamp = '';

  // Dropdown options
  datasetIds: string[] = [];
  modelIds: string[] = [];
  metricIds: string[] = [];
  versions: string[] = [];

  showExportDialog = false;
  exportData = {
    taskType: 'discovery.temporal',
    name: '',
    description: ''
  };

  constructor() {}

  ngOnInit() {
    this.updateDropdownOptions();
  }

  ngOnChanges() {
    this.updateDropdownOptions();
    this.updateCurrentItemInfo();
  }

  updateDropdownOptions() {
    // Extract unique IDs from available data
    this.datasetIds = this.getUniqueIds(this.availableDatasets, 'dataset_id');
    this.modelIds = this.getUniqueIds(this.availableModels, 'modl_id');
    this.metricIds = this.getUniqueIds(this.availableMetrics, 'metric_id');
  }

  getUniqueIds(items: any[], idField: string): string[] {
    const ids = [...new Set(items.map(item => String(item[idField])))];
    return ids.sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
    });
  }

  updateCurrentItemInfo() {
    if (!this.currentItem) {
      this.showPlaceholder();
      return;
    }

    console.log('Updating current item info:', this.currentItem);
    console.log('Current item type:', this.currentItemType);

    // Use the currentItemType from the parent component
    this.selectedType = this.currentItemType;

    // Determine the type of current item
    if (this.currentItem.data && this.currentItem.data.dataset_id) {
      console.log('Configuring existing dataset');
      this.selectedId = String(this.currentItem.data.dataset_id);
      this.selectedVersion = this.currentItem.data.selected_version || '';
      this.populateDatasetFields(this.currentItem);
    } else if (this.currentItem.data && this.currentItem.data.modl_id) {
      console.log('Configuring existing model');
      this.selectedId = String(this.currentItem.data.modl_id);
      this.selectedVersion = this.currentItem.data.selected_version || '';
      this.populateModelFields(this.currentItem);
    } else if (this.currentItem.data && this.currentItem.data.metric_id) {
      console.log('Configuring existing metric');
      this.selectedId = String(this.currentItem.data.metric_id);
      this.selectedVersion = this.currentItem.data.selected_version || '';
      this.populateMetricFields(this.currentItem);
    } else {
      // New item - clear fields and enable dropdowns
      console.log('Configuring new item of type:', this.selectedType);
      this.selectedId = '';
      this.selectedVersion = '';
      this.versions = [];
      this.clearInfoFields();
    }

    this.updateVersions();
  }

  clearInfoFields() {
    console.log('Clearing info fields');
    this.itemName = '';
    this.itemDescription = '';
    this.itemAuthor = '';
    this.itemVisibility = '';
    this.itemUrl = '';
    this.itemTimestamp = '';
  }

  showPlaceholder() {
    this.selectedType = null;
    this.selectedId = '';
    this.selectedVersion = '';
    this.clearInfoFields();
    this.versions = [];
  }

  populateDatasetFields(item: any) {
    const data = item.data;
    if (data.dataset_id) {
      this.selectedId = String(data.dataset_id);
      
      // Get selected version or first version
      if (data.selected_version) {
        this.selectedVersion = String(data.selected_version);
      } else if (data.dataset_version_info_list && data.dataset_version_info_list.length > 0) {
        this.selectedVersion = String(data.dataset_version_info_list[0].version.version_number);
      }
      
      this.updateVersions();
      this.updateDatasetInfo();
    }
  }

  populateModelFields(item: any) {
    const data = item.data;
    if (data.modl_id) {
      this.selectedId = String(data.modl_id);
      
      // Get selected version or first version
      if (data.selected_version) {
        this.selectedVersion = String(data.selected_version);
      } else if (data.modl_version_info_list && data.modl_version_info_list.length > 0) {
        this.selectedVersion = String(data.modl_version_info_list[0].version.version_number);
      }
      
      this.updateVersions();
      this.updateModelInfo();
    }
  }

  populateMetricFields(item: any) {
    const data = item.data;
    if (data.metric_id) {
      this.selectedId = String(data.metric_id);
      
      // Get selected version or first version
      if (data.selected_version) {
        this.selectedVersion = String(data.selected_version);
      } else if (data.metric_version_info_list && data.metric_version_info_list.length > 0) {
        this.selectedVersion = String(data.metric_version_info_list[0].version.version_number);
      }
      
      this.updateVersions();
      this.updateMetricInfo();
    }
  }

  onIdSelect() {
    console.log('ID selected:', this.selectedId, 'Type:', this.selectedType);
    this.updateVersions();
    this.updateInfo();
  }

  onVersionSelect() {
    console.log('Version selected:', this.selectedVersion);
    this.updateInfo();
  }

  updateVersions() {
    if (!this.selectedId || !this.selectedType) {
      this.versions = [];
      return;
    }

    console.log('Updating versions for ID:', this.selectedId, 'Type:', this.selectedType);

    if (this.selectedType === 'dataset') {
      const dataset = this.availableDatasets.find(d => String(d.dataset_id) === this.selectedId);
      if (dataset && dataset.dataset_version_info_list) {
        this.versions = dataset.dataset_version_info_list.map((v: any) => String(v.version.version_number));
        console.log('Dataset versions found:', this.versions);
      }
    } else if (this.selectedType === 'model') {
      const model = this.availableModels.find(m => String(m.modl_id) === this.selectedId);
      if (model && model.modl_version_info_list) {
        this.versions = model.modl_version_info_list.map((v: any) => String(v.version.version_number));
        console.log('Model versions found:', this.versions);
      }
    } else if (this.selectedType === 'metric') {
      const metric = this.availableMetrics.find(m => String(m.metric_id) === this.selectedId);
      if (metric && metric.metric_version_info_list) {
        this.versions = metric.metric_version_info_list.map((v: any) => String(v.version.version_number));
        console.log('Metric versions found:', this.versions);
      }
    }

    // Set first version if none selected
    if (this.versions.length > 0 && !this.selectedVersion) {
      this.selectedVersion = this.versions[0];
    }
  }

  updateInfo() {
    if (this.selectedType === 'dataset') {
      this.updateDatasetInfo();
    } else if (this.selectedType === 'model') {
      this.updateModelInfo();
    } else if (this.selectedType === 'metric') {
      this.updateMetricInfo();
    }
  }

  updateDatasetInfo() {
    const dataset = this.availableDatasets.find(d => String(d.dataset_id) === this.selectedId);
    if (dataset && this.selectedVersion) {
      const versionInfo = dataset.dataset_version_info_list.find(
        (v: any) => String(v.version.version_number) === this.selectedVersion
      );
      if (versionInfo) {
        this.itemName = versionInfo.dataset.dataset_name;
        this.itemDescription = versionInfo.description.description_text;
        this.itemAuthor = versionInfo.description.author;
        this.itemVisibility = versionInfo.metadata.visibility;
        this.itemUrl = versionInfo.metadata.url;
        this.itemTimestamp = versionInfo.metadata.upload_timestamp;
      }
    }
  }

  updateModelInfo() {
    const model = this.availableModels.find(m => String(m.modl_id) === this.selectedId);
    if (model && this.selectedVersion) {
      const versionInfo = model.modl_version_info_list.find(
        (v: any) => String(v.version.version_number) === this.selectedVersion
      );
      if (versionInfo) {
        this.itemName = versionInfo.modl.modl_name;
        this.itemDescription = versionInfo.description.description_text;
        this.itemAuthor = versionInfo.description.author;
        this.itemVisibility = versionInfo.metadata.visibility;
        this.itemUrl = versionInfo.metadata.url;
        this.itemTimestamp = versionInfo.metadata.upload_timestamp;
      }
    }
  }

  updateMetricInfo() {
    const metric = this.availableMetrics.find(m => String(m.metric_id) === this.selectedId);
    if (metric && this.selectedVersion) {
      const versionInfo = metric.metric_version_info_list.find(
        (v: any) => String(v.version.version_number) === this.selectedVersion
      );
      if (versionInfo) {
        this.itemName = versionInfo.metric.metric_name;
        this.itemDescription = versionInfo.description.description_text;
        this.itemAuthor = versionInfo.description.author;
        this.itemVisibility = versionInfo.metadata.visibility;
        this.itemUrl = versionInfo.metadata.url;
        this.itemTimestamp = versionInfo.metadata.upload_timestamp;
      }
    }
  }

  onApplyItem() {
    if (this.currentItem && this.selectedId && this.selectedVersion) {
      const applyData = {
        item: this.currentItem,
        type: this.selectedType,
        id: this.selectedId,
        version: this.selectedVersion
      };
      this.applyItem.emit(applyData);
    }
  }

  onExportContext() {
    this.exportContext.emit();
  }

  onAddDataset() {
    this.addDataset.emit();
  }

  onAddModel() {
    this.addModel.emit();
  }

  onAddMetric() {
    this.addMetric.emit();
  }

  onRemoveItem() {
    this.removeItem.emit();
  }

  showExport() {
    this.showExportDialog = true;
  }

  hideExport() {
    this.showExportDialog = false;
  }

  doExport() {
    this.exportContext.emit();
    this.hideExport();
  }
} 