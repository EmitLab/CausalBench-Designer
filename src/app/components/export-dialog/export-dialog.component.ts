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
  @Input() selectedTaskType = 'discovery.temporal';
  
  @Output() closeDialog = new EventEmitter<void>();

  // Form fields
  name = '';
  description = '';

  // Computed properties for summary
  get configuredDatasetsCount(): number {
    return this.datasets.filter(d => d.data && d.data.dataset_id && d.data.selected_version).length;
  }

  get configuredModelsCount(): number {
    return this.getFilteredModels().length;
  }

  get configuredMetricsCount(): number {
    return this.getFilteredMetrics().length;
  }

  onClose() {
    this.closeDialog.emit();
  }

  private getFilteredModels() {
    return this.models.filter(model => {
      // First check if it's a configured model
      if (!model.data || !model.data.modl_id || !model.data.selected_version) {
        return false;
      }

      // Show new models that don't have version info yet
      if (!model.data.modl_version_info_list) {
        return true;
      }

      // Check for tasks in version info list
      const versionInfo = model.data.modl_version_info_list.find(
        (v: any) => String(v.version.version_number) === model.data.selected_version
      );

      if (versionInfo?.version?.tasks) {
        return versionInfo.version.tasks.some((task: any) => 
          task.task_name === this.selectedTaskType
        );
      }

      // Fallback to checking direct version tasks
      const tasks = model.data?.version?.tasks || [];
      return tasks.some((task: any) => task.task_name === this.selectedTaskType);
    });
  }

  private getFilteredMetrics() {
    return this.metrics.filter(metric => {
      // First check if it's a configured metric
      if (!metric.data || !metric.data.metric_id || !metric.data.selected_version) {
        return false;
      }

      // Show new metrics that don't have version info yet
      if (!metric.data.metric_version_info_list) {
        return true;
      }

      // Check for tasks in version info list
      const versionInfo = metric.data.metric_version_info_list.find(
        (v: any) => String(v.version.version_number) === metric.data.selected_version
      );

      if (versionInfo?.version?.tasks) {
        return versionInfo.version.tasks.some((task: any) => 
          task.task_name === this.selectedTaskType
        );
      }

      // Fallback to checking direct version tasks
      const tasks = metric.data?.version?.tasks || [];
      return tasks.some((task: any) => task.task_name === this.selectedTaskType);
    });
  }

  onExport() {
    // Collect all items from each view
    const allDatasets = [];
    const allModels = [];
    const allMetrics = [];

    // Get all datasets (datasets are global)
    for (const item of this.datasets) {
      if (item.data && item.data.dataset_id && item.data.selected_version) {
        // Use generic file mappings if available, otherwise fall back to defaults
        let fileMappings = { data: 'file1', ground_truth: 'file2' };
        
        if (item.data.file_mappings) {
          fileMappings = {
            data: item.data.file_mappings.generic_data || 'file1',
            ground_truth: item.data.file_mappings.generic_ground_truth || 'file2'
          };
        }
        
        allDatasets.push({
          id: item.data.dataset_id,
          version: item.data.selected_version,
          fileMappings: fileMappings
        });
      }
    }

    // Get filtered models with hyperparameters
    for (const item of this.getFilteredModels()) {
      const modelData = {
        id: item.data.modl_id,
        version: item.data.selected_version,
        hyperparameterSets: item.data.hyperparameter_sets || []
      };
      allModels.push(modelData);
    }

    // Get filtered metrics with hyperparameters
    for (const item of this.getFilteredMetrics()) {
      const metricData = {
        id: item.data.metric_id,
        version: item.data.selected_version,
        hyperparameterSets: item.data.hyperparameter_sets || []
      };
      allMetrics.push(metricData);
    }

    // Format the output
    let output = `#CausalBench GUI Helper v1.0f. -Kpkc.
from causalbench.modules import Run
from causalbench.modules.context import Context
from causalbench.modules.dataset import Dataset
from causalbench.modules.model import Model
from causalbench.modules.metric import Metric

context1: Context = Context.create(task='${this.selectedTaskType}',
   name='${this.name}',
   description='${this.description}',
   datasets=[
`;

    // Add datasets
    for (let i = 0; i < allDatasets.length; i++) {
      const dataset = allDatasets[i];
      const fileMapping = `{'data': '${dataset.fileMappings.data}', 'ground_truth': '${dataset.fileMappings.ground_truth}'}`;
      output += `      (Dataset(module_id=${dataset.id}, version=${dataset.version}), ${fileMapping})`;
      if (i < allDatasets.length - 1) {
        output += ',';
      }
      output += '\n';
    }

    output += '   ],\n   models=[';

    // Add models with hyperparameters
    const modelEntries = [];
    for (const model of allModels) {
      // If model has hyperparameter sets, create entries for each set
      if (model.hyperparameterSets && model.hyperparameterSets.length > 0) {
        for (const hyperparamSet of model.hyperparameterSets) {
          // Format hyperparameters
          const hyperparamEntries = [];
          for (const [paramName, paramValue] of Object.entries(hyperparamSet.parameters)) {
            if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
              hyperparamEntries.push(`'${paramName}': '${paramValue}'`);
            }
          }
          
          const hyperparamConfig = hyperparamEntries.length > 0 ? 
            `{${hyperparamEntries.join(', ')}}` : '{}';
          
          modelEntries.push(`(Model(module_id=${model.id}, version=${model.version}), ${hyperparamConfig})`);
        }
      } else {
        // No hyperparameters defined
        modelEntries.push(`(Model(module_id=${model.id}, version=${model.version}), {})`);
      }
    }
    
    output += modelEntries.join(', ');

    output += '],\n   metrics=[';

    // Add metrics with hyperparameters
    const metricEntries = [];
    for (const metric of allMetrics) {
      // If metric has hyperparameter sets, create entries for each set
      if (metric.hyperparameterSets && metric.hyperparameterSets.length > 0) {
        for (const hyperparamSet of metric.hyperparameterSets) {
          // Format hyperparameters
          const hyperparamEntries = [];
          for (const [paramName, paramValue] of Object.entries(hyperparamSet.parameters)) {
            if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
              hyperparamEntries.push(`'${paramName}': '${paramValue}'`);
            }
          }
          
          const hyperparamConfig = hyperparamEntries.length > 0 ? 
            `{${hyperparamEntries.join(', ')}}` : '{}';
          
          metricEntries.push(`(Metric(module_id=${metric.id}, version=${metric.version}), ${hyperparamConfig})`);
        }
      } else {
        // No hyperparameters defined
        metricEntries.push(`(Metric(module_id=${metric.id}, version=${metric.version}), {})`);
      }
    }
    
    output += metricEntries.join(', ');

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