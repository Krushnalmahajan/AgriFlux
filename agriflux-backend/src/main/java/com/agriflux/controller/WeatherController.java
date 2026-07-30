package com.agriflux.controller;

import com.agriflux.dto.response.WeatherResponse;
import com.agriflux.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WeatherController {

    private final WeatherService weatherService;

    // GET /api/weather?city=Pune
    // Public route — no token needed
    @GetMapping
    public ResponseEntity<WeatherResponse> getWeatherByCity(
            @RequestParam String city) {
        return ResponseEntity.ok(
                weatherService.getWeatherByCity(city));
    }

    // GET /api/weather/forecast?city=Pune
    // Returns current + 5-day forecast
    @GetMapping("/forecast")
    public ResponseEntity<WeatherResponse> getWeatherWithForecast(
            @RequestParam String city) {
        return ResponseEntity.ok(
                weatherService.getWeatherWithForecast(city));
    }

    // GET /api/weather/coordinates?lat=18.52&lon=73.85
    // Used when browser shares user location
    @GetMapping("/coordinates")
    public ResponseEntity<WeatherResponse> getWeatherByCoords(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        return ResponseEntity.ok(
                weatherService.getWeatherByCoordinates(lat, lon));
    }
}