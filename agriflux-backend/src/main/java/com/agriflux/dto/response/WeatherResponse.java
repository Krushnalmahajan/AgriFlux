package com.agriflux.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherResponse {

    private String city;
    private String country;
    private Double temperature;        // in Celsius
    private Double feelsLike;
    private Double humidity;           // percentage
    private Double windSpeed;          // m/s
    private String description;        // "clear sky", "light rain"
    private String icon;               // weather icon code
    private String iconUrl;            // full icon URL for React

    // Farming-specific advice based on weather
    private String farmingAdvice;

    // 5-day forecast
    private List<ForecastDay> forecast;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForecastDay {
        private String date;
        private Double minTemp;
        private Double maxTemp;
        private String description;
        private String iconUrl;
    }
}