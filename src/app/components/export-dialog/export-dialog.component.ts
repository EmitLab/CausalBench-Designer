import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent {
  @Input() showDialog = false;
  @Input() datasets: any[] = [];
  @Input() models: any[] = [];
  @Input() metrics: any[] = [];
  
  @Output() closeDialog = new EventEmitter<void>();

  // Form fields
  taskType = 'discovery.temporal';
  name = '';
  description = '';

  // Task type options
  taskTypeOptions = ['discovery.temporal', 'discovery.static'];

  // Computed properties for summary
  get configuredDatasetsCount(): number {
    return this.datasets.filter(d => d.data && d.data.dataset_id && d.data.selected_version).length;
  }

  get configuredModelsCount(): number {
    return this.models.filter(m => m.data && m.data.modl_id && m.data.selected_version).length;
  }

  get configuredMetricsCount(): number {
    return this.metrics.filter(met => met.data && met.data.metric_id && met.data.selected_version).length;
  }

  onClose() {
    this.closeDialog.emit();
  }

  onExport() {
    // Collect all items from each view
    const allDatasets = [];
    const allModels = [];
    const allMetrics = [];

    // Get all datasets
    for (const item of this.datasets) {
      if (item.data && item.data.dataset_id && item.data.selected_version) {
        allDatasets.push({
          id: item.data.dataset_id,
          version: item.data.selected_version
        });
      }
    }

    // Get all models
    for (const item of this.models) {
      if (item.data && item.data.modl_id && item.data.selected_version) {
        allModels.push({
          id: item.data.modl_id,
          version: item.data.selected_version
        });
      }
    }

    // Get all metrics
    for (const item of this.metrics) {
      if (item.data && item.data.metric_id && item.data.selected_version) {
        allMetrics.push({
          id: item.data.metric_id,
          version: item.data.selected_version
        });
      }
    }

    // Format the output
    let output = `#CausalBench GUI Helper v1.0d. -Kpkc.
from causalbench.modules import Run
from causalbench.modules.context import Context
from causalbench.modules.dataset import Dataset
from causalbench.modules.model import Model
from causalbench.modules.metric import Metric

context1: Context = Context.create(task='${this.taskType}',
   name='${this.name}',
   description='${this.description}',
   datasets=[
`;

    // Add datasets
    for (let i = 0; i < allDatasets.length; i++) {
      const dataset = allDatasets[i];
      output += `      (Dataset(module_id=${dataset.id}, version=${dataset.version}), {'data': 'file1', 'ground_truth': 'file2'})`;
      if (i < allDatasets.length - 1) {
        output += ',';
      }
      output += '\n';
    }

    output += '   ],\n   models=[';

    // Add models
    for (let i = 0; i < allModels.length; i++) {
      const model = allModels[i];
      output += `(Model(module_id=${model.id}, version=${model.version}), {})`;
      if (i < allModels.length - 1) {
        output += ', ';
      }
    }

    output += '],\n   metrics=[';

    // Add metrics
    for (let i = 0; i < allMetrics.length; i++) {
      const metric = allMetrics[i];
      output += `(Metric(module_id=${metric.id}, version=${metric.version}), {})`;
      if (i < allMetrics.length - 1) {
        output += ', ';
      }
    }

    output += `])

run: Run = context1.execute()
print(run)`;

    // Create and download the file
    this.downloadFile(output, 'context_export.py');
    
    // Close the dialog
    this.onClose();
  }

  private downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log(`Context exported successfully to: ${filename}`);
  }
} 