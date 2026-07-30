package com.agriflux.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;

    // Optional: pass conversation history for context
    private String conversationHistory;
}