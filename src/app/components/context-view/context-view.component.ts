import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-context-view',
  templateUrl: './context-view.component.html',
  styleUrls: ['./context-view.component.scss']
})
export class ContextViewComponent implements OnInit {
  tasks: string[] = [];
  selectedTaskType: string = '';
  loadingTasks: boolean = false;

  @Input() datasets: any[] = [];
  @Input() models: any[] = [];
  @Input() metrics: any[] = [];
  @Input() loadingDatasets: boolean = false;
  @Input() loadingModels: boolean = false;
  @Input() loadingMetrics: boolean = false;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() addModel = new EventEmitter<void>();
  @Output() addMetric = new EventEmitter<void>();
  @Output() taskTypeChange = new EventEmitter<string>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchTasks();
  }

  get filteredModels(): any[] {
    if (!this.selectedTaskType || !this.models) return [];
    return this.models.filter(model => {
      // Show new models that don't have data yet
      if (!model.data || Object.keys(model.data).length === 0) {
        return true;
      }

      // Check for tasks in different possible locations
      const versionInfo = model.data.modl_version_info_list?.find(
        (v: any) => String(v.version.version_number) === model.data.selected_version
      );

      if (versionInfo?.version?.tasks) {
        return versionInfo.version.tasks.some((task: any) => 
          task.task_name === this.selectedTaskType
        );
      }

      // Fallback to checking the direct version tasks
      const tasks = model.data?.version?.tasks || [];
      return tasks.some((task: any) => task.task_name === this.selectedTaskType);
    });
  }

  get filteredMetrics(): any[] {
    if (!this.selectedTaskType || !this.metrics) return [];
    return this.metrics.filter(metric => {
      // Show new metrics that don't have data yet
      if (!metric.data || Object.keys(metric.data).length === 0) {
        return true;
      }

      // Check for tasks in different possible locations
      const versionInfo = metric.data.metric_version_info_list?.find(
        (v: any) => String(v.version.version_number) === metric.data.selected_version
      );

      if (versionInfo?.version?.tasks) {
        return versionInfo.version.tasks.some((task: any) => 
          task.task_name === this.selectedTaskType
        );
      }

      // Fallback to checking the direct version tasks
      const tasks = metric.data?.version?.tasks || [];
      return tasks.some((task: any) => task.task_name === this.selectedTaskType);
    });
  }

  fetchTasks() {
    this.loadingTasks = true;
    this.apiService.getTasks().subscribe({
      next: (tasks: string[]) => {
        this.tasks = tasks;
        this.loadingTasks = false;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.loadingTasks = false;
      }
    });
  }

  onTaskTypeChange(event: any) {
    this.selectedTaskType = event.target.value;
    this.taskTypeChange.emit(this.selectedTaskType);
  }

  onAddModel() {
    this.addModel.emit();
  }

  onAddMetric() {
    this.addMetric.emit();
  }
}