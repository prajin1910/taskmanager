import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-roadmap-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="roadmap-container">
      <nav class="navbar">
        <div class="container">
          <div class="nav-content">
            <div class="nav-brand">TaskManager Pro</div>
            <div class="nav-links">
              <button class="btn btn-outline-primary back-btn" (click)="goBack()">
                <span class="icon">←</span> Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container">
        <div class="roadmap-wrapper" *ngIf="task">
          <div class="roadmap-card card">
            <div class="card-header">
              <div class="task-info">
                <h1 class="task-title">{{ task.title }}</h1>
                <span class="priority-badge" [class]="task.priority.toLowerCase()">
                  {{ task.priority }} Priority
                </span>
              </div>
              <p class="task-description">{{ task.description }}</p>
              <div class="task-meta" *ngIf="task.dueDate">
                <span class="due-date">Due: {{ task.dueDate | date:'medium' }}</span>
              </div>
            </div>

            <div class="roadmap-section">
              <div class="section-header">
                <h2 class="section-title">
                  <span class="ai-icon">🤖</span>
                  AI-Generated Roadmap
                </h2>
              </div>
              
              <div class="roadmap-content" *ngIf="task.roadmap">
                <div class="roadmap-text" [innerHTML]="formatRoadmap(task.roadmap)"></div>
              </div>
              
              <div class="no-roadmap" *ngIf="!task.roadmap">
                <div class="no-roadmap-icon">📋</div>
                <h3>No Roadmap Available</h3>
                <p>This task doesn't have an AI-generated roadmap yet.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading task details...</p>
        </div>

        <div class="error-state" *ngIf="!task && !isLoading">
          <h3>Task Not Found</h3>
          <p>The requested task could not be found.</p>
          <button class="btn-primary" (click)="goBack()">Go Back</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .roadmap-container {
      min-height: 100vh;
      background: #000000;
      position: relative;
      overflow: hidden;
    }

    .roadmap-container::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite"/></circle><circle cx="80" cy="30" r="0.5" fill="white" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="4s" repeatCount="indefinite"/></circle><circle cx="40" cy="60" r="0.8" fill="white" opacity="0.7"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.5s" repeatCount="indefinite"/></circle><circle cx="70" cy="80" r="0.6" fill="white" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="3.5s" repeatCount="indefinite"/></circle></svg>') repeat;
      pointer-events: none;
      z-index: 1;
    }

    .navbar {
      background: rgba(20, 20, 30, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 10;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      font-size: 24px;
      font-weight: 700;
      color: #64ffda;
    }

    .back-btn {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #64ffda;
      border: 1px solid #64ffda;
      border-radius: 4px;
      background-color: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      background-color: #64ffda;
      color: #1a1a2e;
    }

    .back-btn .icon {
      margin-right: 6px;
      font-weight: bold;
    }

    .roadmap-wrapper {
      padding: 30px 0;
      position: relative;
      z-index: 10;
    }

    .roadmap-card {
      padding: 40px;
      background: rgba(30, 30, 45, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .task-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .task-title {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      margin: 0;
      flex: 1;
      margin-right: 20px;
    }

    .priority-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .priority-badge.high {
      background: #ff6b6b;
      color: white;
    }

    .priority-badge.medium {
      background: #ffd43b;
      color: #1a1a2e;
    }

    .priority-badge.low {
      background: #51cf66;
      color: white;
    }

    .task-description {
      color: #b0b0b0;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 15px 0;
    }

    .task-meta {
      display: flex;
      gap: 20px;
    }

    .due-date {
      color: #ffd43b;
      font-weight: 500;
      font-size: 14px;
    }

    .roadmap-section {
      margin-top: 30px;
    }

    .section-header {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
    }

    .ai-icon {
      font-size: 28px;
    }

    .roadmap-content {
      background: rgba(20, 20, 30, 0.8);
      border-radius: 12px;
      padding: 30px;
      border: 1px solid rgba(100, 255, 218, 0.2);
    }

    .roadmap-text {
      color: #e0e0e0;
      line-height: 1.8;
      font-size: 16px;
    }

    .roadmap-text ::ng-deep h1,
    .roadmap-text ::ng-deep h2,
    .roadmap-text ::ng-deep h3 {
      color: #64ffda;
      margin-top: 25px;
      margin-bottom: 15px;
    }

    .roadmap-text ::ng-deep h1 {
      font-size: 24px;
    }

    .roadmap-text ::ng-deep h2 {
      font-size: 20px;
    }

    .roadmap-text ::ng-deep h3 {
      font-size: 18px;
    }

    .roadmap-text ::ng-deep ul,
    .roadmap-text ::ng-deep ol {
      margin: 15px 0;
      padding-left: 25px;
    }

    .roadmap-text ::ng-deep li {
      margin: 8px 0;
      color: #e0e0e0;
    }

    .roadmap-text ::ng-deep strong {
      color: #fff;
    }

    .roadmap-text ::ng-deep p {
      margin: 15px 0;
    }

    .no-roadmap {
      text-align: center;
      padding: 60px 20px;
      color: #b0b0b0;
    }

    .no-roadmap-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .no-roadmap h3 {
      color: #fff;
      margin-bottom: 10px;
      font-size: 24px;
    }

    .loading-state,
    .error-state {
      text-align: center;
      padding: 60px 20px;
      color: #b0b0b0;
      position: relative;
      z-index: 10;
    }

    .loading-state .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.2);
      border-top: 4px solid #64ffda;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    .error-state h3 {
      color: #fff;
      margin-bottom: 15px;
      font-size: 24px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .roadmap-card {
        padding: 20px;
        margin: 0 15px;
      }

      .task-info {
        flex-direction: column;
        gap: 15px;
      }

      .task-title {
        margin-right: 0;
      }
    }
  `]
})
export class RoadmapViewComponent implements OnInit {
  task: Task | null = null;
  isLoading = false;
  taskId: number = 0;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      this.loadTask();
    });
  }

  loadTask(): void {
    this.isLoading = true;
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading task:', error);
      }
    });
  }

  formatRoadmap(roadmap: string): string {
    if (!roadmap) return '';
    
    // Convert markdown-like formatting to HTML
    let formatted = roadmap
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>')
      .replace(/^-\s+(.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap consecutive <li> elements in <ol> or <ul>
    formatted = formatted.replace(/(<li>.*?<\/li>)/gs, (match) => {
      if (match.includes('1.')) {
        return '<ol>' + match + '</ol>';
      } else {
        return '<ul>' + match + '</ul>';
      }
    });

    // Wrap in paragraphs
    if (!formatted.startsWith('<h') && !formatted.startsWith('<ul') && !formatted.startsWith('<ol')) {
      formatted = '<p>' + formatted + '</p>';
    }

    return formatted;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}