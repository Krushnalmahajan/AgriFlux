package com.agriflux.service;

import com.agriflux.dto.response.WeatherResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    @Value("${openweather.api.url}")
    private String apiUrl;

    // RestTemplate is Spring's HTTP client
    // Used to call external REST APIs
    private final RestTemplate restTemplate;

    // ── GET CURRENT WEATHER ───────────────────────
    public WeatherResponse getWeatherByCity(String city) {

        // Build URL for OpenWeather current weather API
        String url = apiUrl + "/weather"
                + "?q=" + city
                + "&appid=" + apiKey
                + "&units=metric"     // ← Celsius
                + "&lang=en";

        // Call OpenWeather API
        // Response comes as a Map (JSON → Java Map)
        Map<String, Object> response =
                restTemplate.getForObject(url, Map.class);

        if (response == null) {
            throw new RuntimeException(
                    "Could not fetch weather for: " + city);
        }

        return parseWeatherResponse(response);
    }

    // ── GET WEATHER BY COORDINATES ────────────────
    // Used when user allows location access in browser
    public WeatherResponse getWeatherByCoordinates(
            Double lat, Double lon) {

        String url = apiUrl + "/weather"
                + "?lat=" + lat
                + "&lon=" + lon
                + "&appid=" + apiKey
                + "&units=metric"
                + "&lang=en";

        Map<String, Object> response =
                restTemplate.getForObject(url, Map.class);

        if (response == null) {
            throw new RuntimeException(
                    "Could not fetch weather for coordinates");
        }

        return parseWeatherResponse(response);
    }

    // ── GET 5-DAY FORECAST ────────────────────────
    public WeatherResponse getWeatherWithForecast(String city) {

        // First get current weather
        WeatherResponse current = getWeatherByCity(city);

        // Then get forecast
        String forecastUrl = apiUrl + "/forecast"
                + "?q=" + city
                + "&appid=" + apiKey
                + "&units=metric"
                + "&cnt=40";   // 40 readings = 5 days × 8 (every 3 hrs)

        Map<String, Object> forecastResponse =
                restTemplate.getForObject(
                        forecastUrl, Map.class);

        if (forecastResponse != null) {
            List<WeatherResponse.ForecastDay> forecast =
                    parseForecast(forecastResponse);
            current.setForecast(forecast);
        }

        return current;
    }

    // ── PARSE OPENWEATHER RESPONSE ────────────────
    // OpenWeather returns complex nested JSON
    // We extract only what we need
    @SuppressWarnings("unchecked")
    private WeatherResponse parseWeatherResponse(
            Map<String, Object> data) {

        // Extract nested objects
        Map<String, Object> main =
                (Map<String, Object>) data.get("main");
        Map<String, Object> wind =
                (Map<String, Object>) data.get("wind");
        Map<String, Object> sys =
                (Map<String, Object>) data.get("sys");
        List<Map<String, Object>> weatherList =
                (List<Map<String, Object>>) data.get("weather");
        Map<String, Object> weatherInfo =
                weatherList.get(0);

        String iconCode = (String) weatherInfo.get("icon");
        String description =
                (String) weatherInfo.get("description");
        Double temp = getDouble(main.get("temp"));
        Double humidity = getDouble(main.get("humidity"));

        // Generate farming advice based on weather
        String advice = generateFarmingAdvice(
                description, temp, humidity);

        return WeatherResponse.builder()
                .city((String) data.get("name"))
                .country((String) sys.get("country"))
                .temperature(temp)
                .feelsLike(getDouble(main.get("feels_like")))
                .humidity(humidity)
                .windSpeed(getDouble(wind.get("speed")))
                .description(description)
                .icon(iconCode)
                .iconUrl("https://openweathermap.org/img/wn/"
                        + iconCode + "@2x.png")
                .farmingAdvice(advice)
                .forecast(new ArrayList<>())
                .build();
    }

    // ── PARSE 5-DAY FORECAST ──────────────────────
    @SuppressWarnings("unchecked")
    private List<WeatherResponse.ForecastDay> parseForecast(
            Map<String, Object> data) {

        List<Map<String, Object>> list =
                (List<Map<String, Object>>) data.get("list");

        List<WeatherResponse.ForecastDay> forecast =
                new ArrayList<>();

        // Get one reading per day (every 8th reading = next day)
        // OpenWeather gives reading every 3 hours
        // 8 readings × 3 hours = 24 hours = 1 day
        for (int i = 0; i < list.size(); i += 8) {
            if (forecast.size() >= 5) break;

            Map<String, Object> item = list.get(i);
            Map<String, Object> main =
                    (Map<String, Object>) item.get("main");
            List<Map<String, Object>> weatherList =
                    (List<Map<String, Object>>) item.get("weather");
            Map<String, Object> weatherInfo =
                    weatherList.get(0);

            String iconCode =
                    (String) weatherInfo.get("icon");

            forecast.add(WeatherResponse.ForecastDay.builder()
                    .date((String) item.get("dt_txt"))
                    .minTemp(getDouble(main.get("temp_min")))
                    .maxTemp(getDouble(main.get("temp_max")))
                    .description(
                            (String) weatherInfo.get("description"))
                    .iconUrl("https://openweathermap.org/img/wn/"
                            + iconCode + "@2x.png")
                    .build());
        }

        return forecast;
    }

    // ── FARMING ADVICE GENERATOR ──────────────────
    // This is what makes AgriFlux special!
    // Based on weather, give relevant farming advice
    private String generateFarmingAdvice(
            String description, Double temp, Double humidity) {

        StringBuilder advice = new StringBuilder();

        // Temperature-based advice
        if (temp > 38) {
            advice.append("🌡️ Extreme heat — water crops early morning or evening. ");
        } else if (temp > 30) {
            advice.append("☀️ Hot weather — ensure adequate irrigation. ");
        } else if (temp < 10) {
            advice.append("🥶 Cold weather — protect sensitive crops from frost. ");
        } else {
            advice.append("🌤️ Good temperature for farming. ");
        }

        // Rain/weather-based advice
        if (description.contains("rain") ||
                description.contains("drizzle")) {
            advice.append("🌧️ Rain expected — avoid pesticide spraying today. ");
        } else if (description.contains("thunderstorm")) {
            advice.append("⛈️ Storm warning — secure equipment and avoid fieldwork. ");
        } else if (description.contains("clear")) {
            advice.append("✅ Clear sky — good day for spraying and outdoor work. ");
        }

        // Humidity-based advice
        if (humidity > 80) {
            advice.append("💧 High humidity — watch for fungal diseases in crops.");
        } else if (humidity < 30) {
            advice.append("🏜️ Low humidity — increase irrigation frequency.");
        }

        return advice.toString().trim();
    }

    // ── HELPER: Safe Double Extraction ───────────
    private Double getDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Double) return (Double) value;
        if (value instanceof Integer)
            return ((Integer) value).doubleValue();
        if (value instanceof Long)
            return ((Long) value).doubleValue();
        return Double.parseDouble(value.toString());
    }
}