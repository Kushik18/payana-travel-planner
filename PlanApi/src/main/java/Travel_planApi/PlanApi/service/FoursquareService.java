package Travel_planApi.PlanApi.service;

import Travel_planApi.PlanApi.Entity.Itinerary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FoursquareService {

    @Value("${foursquare.api.key}")
    private String apiKey;

    @Value("${foursquare.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public List<Itinerary> searchPlaces(String query, String district) {
        List<Itinerary> results = new ArrayList<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            String near = (district != null && !district.trim().isEmpty()) ? district + ", Karnataka, IN" : "Karnataka, IN";
            String q = (query != null && !query.trim().isEmpty()) ? query : "Tourism";

            String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("query", q)
                    .queryParam("near", near)
                    .queryParam("limit", 5) // Return top 5 matches
                    .queryParam("fields", "fsq_id,name,location,categories,geocodes,photos")
                    .build()
                    .toUriString();

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.GET, entity, (Class<Map<String, Object>>)(Class<?>)Map.class);

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("results")) {
                List<Map<String, Object>> places = (List<Map<String, Object>>) body.get("results");
                
                for (Map<String, Object> p : places) {
                    Itinerary item = new Itinerary();
                    item.setId(-1L); // Indicates external source

                    item.setPlace((String) p.get("name"));

                    // Location extraction
                    if (p.containsKey("location")) {
                        Map<String, Object> location = (Map<String, Object>) p.get("location");
                        if (location.containsKey("formatted_address")) {
                            item.setDescription((String) location.get("formatted_address"));
                        }
                        if (district != null) {
                            item.setDistrict(district);
                        } else if (location.containsKey("locality")) {
                            item.setDistrict((String) location.get("locality"));
                        } else {
                            item.setDistrict("Karnataka");
                        }
                    }

                    // Category extraction
                    if (p.containsKey("categories")) {
                        List<Map<String, Object>> categories = (List<Map<String, Object>>) p.get("categories");
                        if (!categories.isEmpty()) {
                            item.setCategory((String) categories.get(0).get("name"));
                        } else {
                            item.setCategory("Attraction");
                        }
                    } else {
                        item.setCategory("Attraction");
                    }

                    // Geocodes
                    if (p.containsKey("geocodes")) {
                        Map<String, Object> geocodes = (Map<String, Object>) p.get("geocodes");
                        if (geocodes.containsKey("main")) {
                            Map<String, Object> mainGeo = (Map<String, Object>) geocodes.get("main");
                            if (mainGeo.containsKey("latitude")) {
                                item.setLatitude(String.valueOf(mainGeo.get("latitude")));
                            }
                            if (mainGeo.containsKey("longitude")) {
                                item.setLongitude(String.valueOf(mainGeo.get("longitude")));
                            }
                        }
                    }

                    // Photos
                    if (p.containsKey("photos")) {
                        List<Map<String, Object>> photos = (List<Map<String, Object>>) p.get("photos");
                        if (!photos.isEmpty()) {
                            Map<String, Object> photo = photos.get(0);
                            String prefix = (String) photo.get("prefix");
                            String suffix = (String) photo.get("suffix");
                            if (prefix != null && suffix != null) {
                                item.setImageUrl(prefix + "original" + suffix);
                            }
                        }
                    }
                    
                    if (item.getImageUrl() == null) {
                         // Default image if no photo found
                         item.setImageUrl("https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800");
                    }

                    item.setTripWith("Both"); // Default for Foursquare places

                    results.add(item);
                }
            }
        } catch (Exception e) {
            System.err.println("Error calling Foursquare API: " + e.getMessage());
        }

        return results;
    }
}
