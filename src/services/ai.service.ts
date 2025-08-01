import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RoadmapResponse {
  roadmap: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private apiKey = 'AIzaSyAOBvzv7wqVEX30AZWrTHkZJoV4joWCc18';

  constructor(private http: HttpClient) {}

  generateRoadmap(taskTitle: string, taskDescription: string, priority: string): Observable<string> {
    const prompt = `Create a detailed step-by-step roadmap for completing this task:

Title: ${taskTitle}
Description: ${taskDescription}
Priority: ${priority}

Please provide a comprehensive roadmap with:
1. Clear, actionable steps
2. Estimated timeframes for each step
3. Key milestones
4. Potential challenges and solutions
5. Resources needed
6. Success criteria

Format the response as a well-structured roadmap that helps the user achieve their goal efficiently.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-goog-api-key': this.apiKey
    });

    return this.http.post<any>(this.geminiApiUrl, requestBody, { headers }).pipe(
      map(response => {
        if (response.candidates && response.candidates[0] && response.candidates[0].content) {
          return response.candidates[0].content.parts[0].text;
        }
        return 'Unable to generate roadmap at this time.';
      })
    );
  }
}