package com.agriflux.controller;

import com.agriflux.dto.request.ChatRequest;
import com.agriflux.dto.response.ChatResponse;
import com.agriflux.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatbotController {

    private final ChatbotService chatbotService;

    // POST /api/chatbot/chat
    // Public route — no token needed
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(
                chatbotService.chat(request));
    }

    // GET /api/chatbot/health
    // Just to verify chatbot is running
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "AgriBot is ready to help farmers!");
    }
}