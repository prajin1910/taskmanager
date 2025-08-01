package com.example.manager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateRoadmap(String taskTitle, String taskDescription, String priority) {
        try {
            String prompt = String.format(
                "Create a detailed step-by-step roadmap for completing this task:\n\n" +
                "Title: %s\n" +
                "Description: %s\n" +
                "Priority: %s\n\n" +
                "Please provide a comprehensive roadmap with:\n" +
                "1. Clear, actionable steps\n" +
                "2. Estimated timeframes for each step\n" +
                "3. Key milestones\n" +
                "4. Potential challenges and solutions\n" +
                "5. Resources needed\n" +
                "6. Success criteria\n\n" +
                "Format the response as a well-structured roadmap that helps the user achieve their goal efficiently.",
                taskTitle, taskDescription, priority
            );

            // Create request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));

            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make API call
            ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl, HttpMethod.POST, entity, Map.class
            );

            // Extract response text
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    if (candidate.containsKey("content")) {
                        Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");
                        if (contentMap.containsKey("parts")) {
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                            if (!parts.isEmpty()) {
                                Map<String, Object> textPart = parts.get(0);
                                if (textPart.containsKey("text")) {
                                    return (String) textPart.get("text");
                                }
                            }
                        }
                    }
                }
            }
            
            return "Unable to generate roadmap at this time.";
        } catch (Exception e) {
            System.err.println("Error generating roadmap: " + e.getMessage());
            return "Unable to generate roadmap at this time.";
        }
    }
}