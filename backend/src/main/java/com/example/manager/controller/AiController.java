package com.example.manager.controller;

import com.example.manager.dto.RoadmapRequest;
import com.example.manager.dto.RoadmapResponse;
import com.example.manager.service.AiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/generate-roadmap")
    public ResponseEntity<RoadmapResponse> generateRoadmap(@Valid @RequestBody RoadmapRequest request) {
        try {
            String roadmap = aiService.generateRoadmap(
                request.getTaskTitle(),
                request.getTaskDescription(),
                request.getPriority()
            );
            return ResponseEntity.ok(new RoadmapResponse(roadmap));
        } catch (Exception e) {
            return ResponseEntity.ok(new RoadmapResponse("Unable to generate roadmap at this time."));
        }
    }
}