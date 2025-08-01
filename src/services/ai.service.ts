import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RoadmapResponse {
  roadmap: string;
}

export interface RoadmapRequest {
  taskTitle: string;
  taskDescription: string;
  priority: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:8080/api/ai';

  constructor(private http: HttpClient) {}

  generateRoadmap(taskTitle: string, taskDescription: string, priority: string): Observable<string> {
    const requestBody: RoadmapRequest = {
      taskTitle,
      taskDescription,
      priority
    };

    return this.http.post<RoadmapResponse>(`${this.apiUrl}/generate-roadmap`, requestBody)
      .pipe(
        map(response => response.roadmap)
      );
  }