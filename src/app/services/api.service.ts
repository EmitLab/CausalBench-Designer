import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { TokenService } from './token.service';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status_code: number;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Update this base URL to match your API backend
  private baseUrl = 'https://causalbench.org/api'; // Adjust this to your API URL

  // Hardcoded request bodies - paste your pre-formatted request bodies here
  private readonly DATASET_REQUEST_BODY = {
    "showOnlyUserData": false,
    "searchText": "",
    "sortField": "",
    "sortState": "",
    "pageNumber": 0,
    "pageSize": 999999,
    "filters": []
  };

  private readonly MODEL_REQUEST_BODY = {
    "searchText": "",
    "pageNumber": 0,
    "pageSize": 9999,
    "sortField": "Uploaded Date",
    "sortState": "desc",
    "user_id": 2,
    "filters": [
        {
            "name": "Model ID",
            "type": "chips_search_bar",
            "value": [],
            "metaData": []
        },
        {
            "name": "Model Version",
            "type": "chips_search_bar",
            "value": [],
            "metaData": []
        },
        {
            "name": "Runs",
            "type": "chip",
            "value": [],
            "metaData": [
                {
                    "name": ">10s",
                    "value": "10"
                },
                {
                    "name": ">100s",
                    "value": "100"
                },
                {
                    "name": ">1000s",
                    "value": "1000"
                },
                {
                    "name": ">100000s",
                    "value": "100000"
                }
            ]
        },
        {
            "name": "Features",
            "type": "chip",
            "value": [],
            "metaData": [
                {
                    "name": ">10s",
                    "value": "10"
                },
                {
                    "name": ">100s",
                    "value": "100"
                },
                {
                    "name": ">1000s",
                    "value": "1000"
                }
            ]
        },
        {
            "name": "Likes",
            "type": "chip",
            "value": [],
            "metaData": [
                {
                    "name": ">100s",
                    "value": "100"
                },
                {
                    "name": ">1000s",
                    "value": "1000"
                },
                {
                    "name": ">100000s",
                    "value": "100000"
                }
            ]
        },
        {
            "name": "Downloads",
            "type": "chip",
            "value": [],
            "metaData": [
                {
                    "name": ">10s",
                    "value": "10"
                },
                {
                    "name": ">100s",
                    "value": "100"
                },
                {
                    "name": ">1000s",
                    "value": "1000"
                }
            ]
        },
        {
            "name": "Visibility",
            "type": "chip",
            "value": [],
            "metaData": [
                {
                    "name": "Public",
                    "value": "Public"
                },
                {
                    "name": "Private",
                    "value": "Private"
                }
            ]
        },
        {
            "name": "Tags",
            "type": "chips_search_bar",
            "value": [],
            "metaData": []
        },
        {
            "name": "Verification",
            "type": "chip",
            "value": [],
            "metaData": [
                {
                    "name": "Verified",
                    "value": "Verified"
                },
                {
                    "name": "Not Verified",
                    "value": "Not_Verified"
                }
            ]
        },
        {
            "name": "Status",
            "type": "chip",
            "value": [],
            "metaData": [
                {
                    "name": "Active",
                    "value": "Active"
                },
                {
                    "name": "Deactive",
                    "value": "Deactive"
                }
            ]
        }
    ],
    "showOnlyUserData": false
  };

  private readonly METRIC_REQUEST_BODY = {
    "showOnlyUserData": false,
    "searchText": "",
    "sortField": "",
    "sortState": "",
    "pageNumber": 0,
    "pageSize": 20,
    "filters": [],
    "user_id": "1"
  };

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  // Get headers with dynamic token
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Accept-Encoding': 'gzip, deflate, br',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Get datasets from API - expects YAML format: { data: { dataset_descriptors: [...] } }
  getDatasets(): Observable<any[]> {
    console.log('Sending dataset request body:', this.DATASET_REQUEST_BODY);
    return this.http.post<any>(`${this.baseUrl}/dataset_version/fetch`, this.DATASET_REQUEST_BODY, { headers: this.getHeaders() }).pipe(
      map(response => {
        // Handle YAML format: { success: true, message: "...", status_code: 200, data: { dataset_descriptors: [...] } }
        if (response && response.data && response.data.dataset_descriptors) {
          return response.data.dataset_descriptors;
        } else {
          console.warn('Unexpected dataset response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching datasets:', error);
        return of([]);
      })
    );
  }

  // Get models from API - expects YAML format: { data: { modl_descriptors: [...] } }
  getModels(): Observable<any[]> {
    console.log('Sending model request body:', this.MODEL_REQUEST_BODY);
    return this.http.post<any>(`${this.baseUrl}/model_version/fetch`, this.MODEL_REQUEST_BODY, { headers: this.getHeaders() }).pipe(
      map(response => {
        // Handle YAML format: { success: true, message: "...", status_code: 200, data: { modl_descriptors: [...] } }
        if (response && response.data && response.data.modl_descriptors) {
          return response.data.modl_descriptors;
        } else {
          console.warn('Unexpected model response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching models:', error);
        return of([]);
      })
    );
  }

  // Get metrics from API - expects YAML format: { data: { metric_descriptors: [...] } }
  getMetrics(): Observable<any[]> {
    console.log('Sending metric request body:', this.METRIC_REQUEST_BODY);
    return this.http.post<any>(`${this.baseUrl}/metric_version/fetch`, this.METRIC_REQUEST_BODY, { headers: this.getHeaders() }).pipe(
      map(response => {
        // Handle YAML format: { success: true, message: "...", status_code: 200, data: { metric_descriptors: [...] } }
        if (response && response.data && response.data.metric_descriptors) {
          return response.data.metric_descriptors;
        } else {
          console.warn('Unexpected metric response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching metrics:', error);
        return of([]);
      })
    );
  }

  // Alternative endpoints if your API uses different paths
  // getDatasetsYaml(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/datasets-yaml`, { headers: this.headers }).pipe(
  //     catchError(error => {
  //       console.error('Error fetching datasets YAML:', error);
  //       return of(null);
  //     })
  //   );
  // }

  // getModelsYaml(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/models-yaml`, { headers: this.headers }).pipe(
  //     catchError(error => {
  //       console.error('Error fetching models YAML:', error);
  //       return of(null);
  //     })
  //   );
  // }

  // getMetricsYaml(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/metrics-yaml`, { headers: this.headers }).pipe(
  //     catchError(error => {
  //       console.error('Error fetching metrics YAML:', error);
  //       return of(null);
  //     })
  //   );
  // }
} 