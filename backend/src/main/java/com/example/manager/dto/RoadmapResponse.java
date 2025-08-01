package com.example.manager.dto;

public class RoadmapResponse {
    private String roadmap;

    // Constructors
    public RoadmapResponse() {}

    public RoadmapResponse(String roadmap) {
        this.roadmap = roadmap;
    }

    // Getters and Setters
    public String getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(String roadmap) {
        this.roadmap = roadmap;
    }
}