package Travel_planApi.PlanApi.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Value("${weather.api.key:DEMO}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * GET /api/weather/forecast?city=Coorg&days=5
     * Proxies OpenWeatherMap 5-day forecast to the frontend.
     * Falls back to mock data when API key is not configured.
     */
    @GetMapping("/forecast")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> getForecast(
            @RequestParam String city,
            @RequestParam(defaultValue = "5") int days) {

        try {
            // 1. Geocode the city using Open-Meteo
            String geoUrl = String.format("https://geocoding-api.open-meteo.com/v1/search?name=%s&count=1", city);
            Map<String, Object> geoResponse = restTemplate.getForObject(geoUrl, Map.class);
            
            if (geoResponse != null && geoResponse.containsKey("results")) {
                java.util.List<Map<String, Object>> results = (java.util.List<Map<String, Object>>) geoResponse.get("results");
                if (!results.isEmpty()) {
                    Map<String, Object> location = results.get(0);
                    double lat = (Double) location.get("latitude");
                    double lon = (Double) location.get("longitude");

                    // 2. Fetch forecast using Open-Meteo
                    String forecastUrl = String.format(
                        "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&daily=temperature_2m_max,relative_humidity_2m_max,weathercode&timezone=auto&forecast_days=%d",
                        lat, lon, days
                    );
                    
                    Map<String, Object> weatherResponse = restTemplate.getForObject(forecastUrl, Map.class);
                    
                    if (weatherResponse != null && weatherResponse.containsKey("daily")) {
                        Map<String, Object> daily = (Map<String, Object>) weatherResponse.get("daily");
                        java.util.List<String> times = (java.util.List<String>) daily.get("time");
                        java.util.List<Double> temps = (java.util.List<Double>) daily.get("temperature_2m_max");
                        java.util.List<Integer> hums = (java.util.List<Integer>) daily.get("relative_humidity_2m_max");
                        java.util.List<Integer> codes = (java.util.List<Integer>) daily.get("weathercode");
                        
                        java.util.List<Map<String, Object>> mappedList = new java.util.ArrayList<>();
                        
                        for (int i = 0; i < times.size(); i++) {
                            int code = codes.get(i);
                            String description = "Clear";
                            String icon = "01d";
                            
                            // Map WMO Weather codes to OpenWeatherMap style
                            if (code == 1 || code == 2 || code == 3) { description = "Partly Cloudy"; icon = "02d"; }
                            else if (code == 45 || code == 48) { description = "Misty"; icon = "50d"; }
                            else if (code >= 51 && code <= 67) { description = "Rain Expected"; icon = "10d"; }
                            else if (code >= 71 && code <= 77) { description = "Snow"; icon = "13d"; }
                            else if (code >= 80 && code <= 82) { description = "Rain Expected"; icon = "09d"; }
                            else if (code >= 85 && code <= 86) { description = "Snow"; icon = "13d"; }
                            else if (code >= 95) { description = "Thunderstorm"; icon = "11d"; }
                            
                            Map<String, Object> main = Map.of(
                                "temp", temps.get(i) != null ? Math.round(temps.get(i)) : 0, 
                                "humidity", hums.get(i) != null ? hums.get(i) : 0
                            );
                            Map<String, Object> weather = Map.of("description", description, "icon", icon);
                            
                            Map<String, Object> entry = new java.util.HashMap<>();
                            entry.put("dt_txt", times.get(i) + " 12:00:00");
                            entry.put("main", main);
                            entry.put("weather", java.util.List.of(weather));
                            
                            mappedList.add(entry);
                        }
                        
                        return ResponseEntity.ok(Map.of(
                            "city", Map.of("name", city),
                            "list", mappedList,
                            "mock", false
                        ));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching from Open-Meteo: " + e.getMessage());
        }
        
        // Graceful fallback to mock data
        return ResponseEntity.ok(buildMockForecast(city, days));
    }

    /**
     * Mock forecast data so the UI works even if API fails.
     */
    private Map<String, Object> buildMockForecast(String city, int days) {
        java.util.List<Map<String, Object>> list = new java.util.ArrayList<>();
        String[] conditions  = {"Sunny", "Partly Cloudy", "Rain Expected", "Cloudy", "Clear", "Thunderstorm", "Misty"};
        String[] icons       = {"01d", "02d", "10d", "03d", "01d", "11d", "50d"};
        int[]    temps       = {28, 24, 21, 26, 30, 22, 25};
        int[]    humidity    = {55, 70, 90, 75, 45, 85, 80};

        for (int i = 0; i < days; i++) {
            int idx = i % conditions.length;
            java.time.LocalDate date = java.time.LocalDate.now().plusDays(i);

            Map<String, Object> main   = Map.of("temp", temps[idx], "humidity", humidity[idx]);
            Map<String, Object> weather = Map.of("description", conditions[idx], "icon", icons[idx]);
            Map<String, Object> entry  = new java.util.HashMap<>();
            entry.put("dt_txt", date + " 12:00:00");
            entry.put("main", main);
            entry.put("weather", java.util.List.of(weather));
            list.add(entry);
        }

        return Map.of(
            "city",  Map.of("name", city),
            "list",  list,
            "mock",  true
        );
    }
}
