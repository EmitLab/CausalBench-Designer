import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CausalBench GUI';
  datasets: any[] = [];
  models: any[] = [];
  metrics: any[] = [];
  currentItem: any = null;
  currentItemType: 'dataset' | 'model' | 'metric' | null = null;

  // Available items from API (for selection)
  availableDatasets: any[] = [];
  availableModels: any[] = [];
  availableMetrics: any[] = [];

  // Loading states
  loadingDatasets = false;
  loadingModels = false;
  loadingMetrics = false;

  // Export dialog state
  showExportDialog = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAvailableData();
  }

  loadAvailableData() {
    // Load available datasets from API with default request body
    this.loadingDatasets = true;
    this.apiService.getDatasets().subscribe({
      next: (data) => {
        this.availableDatasets = data;
        console.log('Available datasets loaded:', data);
        this.loadingDatasets = false;
      },
      error: (error) => {
        console.error('Error loading datasets:', error);
        this.loadingDatasets = false;
        // Fallback to mock data or show error message
      }
    });
    
    // Load available models from API with default request body
    this.loadingModels = true;
    this.apiService.getModels().subscribe({
      next: (data) => {
        this.availableModels = data;
        console.log('Available models loaded:', data);
        this.loadingModels = false;
      },
      error: (error) => {
        console.error('Error loading models:', error);
        this.loadingModels = false;
        // Fallback to mock data or show error message
      }
    });
    
    // Load available metrics from API with default request body
    this.loadingMetrics = true;
    this.apiService.getMetrics().subscribe({
      next: (data) => {
        this.availableMetrics = data;
        console.log('Available metrics loaded:', data);
        this.loadingMetrics = false;
      },
      error: (error) => {
        console.error('Error loading metrics:', error);
        this.loadingMetrics = false;
        // Fallback to mock data or show error message
      }
    });
  }

  onItemSelected(item: any) {
    // Deselect all items across all panels
    this.deselectAllItems();
    
    // Select the new item
    if (item) {
      item.isSelected = true;
      
      // Determine the type of item selected
      if (this.datasets.includes(item)) {
        this.currentItemType = 'dataset';
      } else if (this.models.includes(item)) {
        this.currentItemType = 'model';
      } else if (this.metrics.includes(item)) {
        this.currentItemType = 'metric';
      }
    }
    
    this.currentItem = item;
  }

  deselectAllItems() {
    // Deselect all datasets
    this.datasets.forEach(dataset => {
      dataset.isSelected = false;
    });
    
    // Deselect all models
    this.models.forEach(model => {
      model.isSelected = false;
    });
    
    // Deselect all metrics
    this.metrics.forEach(metric => {
      metric.isSelected = false;
    });
  }

  onAddDataset() {
    const newDataset = {
      data: {},
      isSelected: false
    };
    this.datasets.push(newDataset);
    console.log('Added new dataset:', newDataset);
    this.onItemSelected(newDataset);
  }

  onAddModel() {
    const newModel = {
      data: {},
      isSelected: false
    };
    this.models.push(newModel);
    console.log('Added new model:', newModel);
    this.onItemSelected(newModel);
  }

  onAddMetric() {
    const newMetric = {
      data: {},
      isSelected: false
    };
    this.metrics.push(newMetric);
    console.log('Added new metric:', newMetric);
    this.onItemSelected(newMetric);
  }

  onRemoveItem() {
    if (this.currentItem) {
      // Remove from appropriate array
      if (this.datasets.includes(this.currentItem)) {
        this.datasets = this.datasets.filter(item => item !== this.currentItem);
      } else if (this.models.includes(this.currentItem)) {
        this.models = this.models.filter(item => item !== this.currentItem);
      } else if (this.metrics.includes(this.currentItem)) {
        this.metrics = this.metrics.filter(item => item !== this.currentItem);
      }
      this.currentItem = null;
      this.currentItemType = null;
    }
  }

  onApplyItem(applyData: any) {
    const { item, type, id, version } = applyData;
    
    if (type === 'dataset') {
      const dataset = this.availableDatasets.find(d => String(d.dataset_id) === id);
      if (dataset) {
        const versionInfo = dataset.dataset_version_info_list.find(
          (v: any) => String(v.version.version_number) === version
        );
        if (versionInfo) {
          item.data = { ...dataset };
          item.data.selected_version = version;
          item.data.is_new = false;
          // Update display name
          if (item.getDisplayName) {
            item.getDisplayName = () => versionInfo.dataset.dataset_name;
          }
        }
      }
    } else if (type === 'model') {
      const model = this.availableModels.find(m => String(m.modl_id) === id);
      if (model) {
        const versionInfo = model.modl_version_info_list.find(
          (v: any) => String(v.version.version_number) === version
        );
        if (versionInfo) {
          item.data = { ...model };
          item.data.selected_version = version;
          item.data.is_new = false;
          // Update display name
          if (item.getDisplayName) {
            item.getDisplayName = () => versionInfo.modl.modl_name;
          }
        }
      }
    } else if (type === 'metric') {
      const metric = this.availableMetrics.find(m => String(m.metric_id) === id);
      if (metric) {
        const versionInfo = metric.metric_version_info_list.find(
          (v: any) => String(v.version.version_number) === version
        );
        if (versionInfo) {
          item.data = { ...metric };
          item.data.selected_version = version;
          item.data.is_new = false;
          // Update display name
          if (item.getDisplayName) {
            item.getDisplayName = () => versionInfo.metric.metric_name;
          }
        }
      }
    }
  }

  onExportContext() {
    this.showExportDialog = true;
  }

  onCloseExportDialog() {
    this.showExportDialog = false;
  }
} 