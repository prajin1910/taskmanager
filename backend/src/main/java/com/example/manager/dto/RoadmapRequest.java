package com.example.manager.dto;

import jakarta.validation.constraints.NotBlank;

public class RoadmapRequest {
    
    @NotBlank(message = "Task title is required")
    private String taskTitle;
    
    @NotBlank(message = "Task description is required")
    private String taskDescription;
    
    @NotBlank(message = "Priority is required")
    private String priority;

    // Constructors
    public RoadmapRequest() {}

    public RoadmapRequest(String taskTitle, String taskDescription, String priority) {
        this.taskTitle = taskTitle;
        this.taskDescription = taskDescription;
        this.priority = priority;
    }

    // Getters and Setters
    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}