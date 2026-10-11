package Travel_planApi.PlanApi.service;

import Travel_planApi.PlanApi.Entity.TripPlace;
import Travel_planApi.PlanApi.Entity.Registor;
import Travel_planApi.PlanApi.Repository.ItineraryRepo;
import Travel_planApi.PlanApi.Repository.RegisterInter;
import Travel_planApi.PlanApi.Repository.TripPlaceRepository;
import Travel_planApi.PlanApi.Repository.FestivalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ReportService {

    @Autowired
    private RegisterInter userRepository;

    @Autowired
    private TripPlaceRepository tripPlaceRepository;

    @Autowired
    private ItineraryRepo placeRepository;

    @Autowired
    private FestivalRepository festivalRepository;

    public Map<String, Object> getOverview() {
        Map<String, Object> overview = new HashMap<>();
        
        // User Activity
        Map<String, Object> users = new HashMap<>();
        users.put("totalUsers", userRepository.count());
        users.put("newUsers", 78); // Mocked for MVP
        users.put("activeUsers", 120); // Mocked for MVP
        overview.put("userActivity", users);

        // Travel Analytics
        Map<String, Object> travel = new HashMap<>();
        travel.put("topDestinations", "Coorg, Mysore");
        travel.put("popularCategories", "Nature, Heritage");
        travel.put("moodTrends", "Adventure, Relaxed");
        overview.put("travelAnalytics", travel);

        // Content
        Map<String, Object> content = new HashMap<>();
        content.put("totalPlaces", placeRepository.count());
        content.put("hiddenGems", 45); // Mocked for MVP
        content.put("festivals", festivalRepository.count());
        overview.put("contentReport", content);

        // Reviews
        Map<String, Object> reviews = new HashMap<>();
        long totalReviews = tripPlaceRepository.findAll().stream()
                .filter(tp -> tp.getReview() != null && !tp.getReview().isEmpty())
                .count();
        reviews.put("totalReviews", totalReviews);
        reviews.put("averageRating", 4.6); // Mocked average
        reviews.put("topRatedPlaces", "Hampi, Gokarna");
        overview.put("reviewsReport", reviews);

        return overview;
    }

    public Map<String, Object> getCustomReport(Map<String, String> filters) {
        String reportType = filters.getOrDefault("reportType", "User Report");
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> summary = new HashMap<>();
        List<String> columns = new ArrayList<>();
        List<Map<String, Object>> rows = new ArrayList<>();

        summary.put("generatedAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        if (reportType.equalsIgnoreCase("User Report")) {
            List<Registor> allUsers = userRepository.findAll();
            summary.put("totalRecords", allUsers.size());
            summary.put("type", "User Activity Report");
            
            columns.addAll(Arrays.asList("ID", "Username", "Email"));
            for (Registor u : allUsers) {
                Map<String, Object> row = new HashMap<>();
                row.put("ID", u.getId());
                row.put("Username", u.getUsername());
                row.put("Email", u.getUseremail());
                rows.add(row);
            }
        } else if (reportType.equalsIgnoreCase("Destination Performance Report")) {
            List<TripPlace> savedTrips = tripPlaceRepository.findAll();
            Map<String, Long> savesMap = savedTrips.stream()
                .filter(tp -> tp.getDistrict() != null)
                .collect(Collectors.groupingBy(TripPlace::getDistrict, Collectors.counting()));
            
            summary.put("totalRecords", savesMap.size());
            summary.put("type", "Destination Performance Report");
            
            columns.addAll(Arrays.asList("Place", "Saves", "Reviews", "Rating"));
            savesMap.forEach((district, saves) -> {
                Map<String, Object> row = new HashMap<>();
                row.put("Place", district);
                row.put("Saves", saves);
                row.put("Reviews", Math.round(saves * 0.4)); // Mocked correlation
                row.put("Rating", 4.0 + Math.random()); // Mocked
                rows.add(row);
            });
            // Sort by saves
            rows.sort((r1, r2) -> Long.compare((Long) r2.get("Saves"), (Long) r1.get("Saves")));
        } else {
            // Generic mock fallback for others
            summary.put("totalRecords", 5);
            summary.put("type", reportType);
            columns.addAll(Arrays.asList("ID", "Name", "Data"));
            for (int i = 1; i <= 5; i++) {
                Map<String, Object> row = new HashMap<>();
                row.put("ID", i);
                row.put("Name", "Mocked Item " + i);
                row.put("Data", "Data " + i);
                rows.add(row);
            }
        }

        response.put("summary", summary);
        response.put("columns", columns);
        response.put("rows", rows);
        return response;
    }
}
