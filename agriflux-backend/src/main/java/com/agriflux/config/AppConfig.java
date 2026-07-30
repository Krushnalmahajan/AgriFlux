package com.agriflux.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    // RestTemplate is used to call external HTTP APIs
    // Like axios in JavaScript
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}