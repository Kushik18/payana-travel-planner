package Travel_planApi.PlanApi.service;

import Travel_planApi.PlanApi.Entity.Itinerary;
import Travel_planApi.PlanApi.Entity.TripPlace;
import Travel_planApi.PlanApi.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private RegisterInter userRepository;

    @Autowired
    private TripPlaceRepository tripPlaceRepository;

    @Autowired
    private ItineraryRepo placeRepository;

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private AdminLogrepo adminRepository;

    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> response = new HashMap<>();
        response.put("overview", getOverviewStats());
        response.put("growth", getLiveGrowthData());
        response.put("categories", getCategoryDistribution());
        response.put("moods", getMockedMoodData());
        response.put("destinations", getTopDestinations());
        response.put("engagement", getMockedEngagementData());
        response.put("systemHealth", getSystemHealth());
        return response;
    }

    private Map<String, Object> getOverviewStats() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalUsers", userRepository.count());
        overview.put("totalItineraries", tripPlaceRepository.count());
        
        long totalReviews = tripPlaceRepository.findAll().stream()
                .filter(tp -> tp.getReview() != null && !tp.getReview().isEmpty())
                .count();
        overview.put("totalReviews", totalReviews);
        
        overview.put("totalPlaces", placeRepository.count());
        overview.put("activeFestivals", festivalRepository.count());
        overview.put("registeredAdmins", adminRepository.count());
        return overview;
    }

    private List<Map<String, Object>> getCategoryDistribution() {
        List<Itinerary> places = placeRepository.findAll();
        Map<String, Long> categoryCounts = places.stream()
                .filter(p -> p.getCategory() != null)
                .flatMap(p -> Arrays.stream(p.getCategory().split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.groupingBy(c -> c, Collectors.counting()));

        List<Map<String, Object>> result = new ArrayList<>();
        categoryCounts.forEach((category, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", category);
            map.put("value", count);
            result.add(map);
        });
        
        // Sort by value descending and take top 6 to avoid clutter
        result.sort((m1, m2) -> Long.compare((Long) m2.get("value"), (Long) m1.get("value")));
        return result.stream().limit(6).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTopDestinations() {
        // Derive from TripPlace (saved itineraries)
        List<TripPlace> savedTrips = tripPlaceRepository.findAll();
        Map<String, Long> destinationSaves = savedTrips.stream()
                .filter(tp -> tp.getDistrict() != null)
                .collect(Collectors.groupingBy(TripPlace::getDistrict, Collectors.counting()));

        Map<String, Double> destinationRatings = savedTrips.stream()
                .filter(tp -> tp.getDistrict() != null && tp.getRating() != null)
                .collect(Collectors.groupingBy(TripPlace::getDistrict, Collectors.averagingInt(TripPlace::getRating)));

        List<Map<String, Object>> result = new ArrayList<>();
        int rank = 1;
        
        List<Map.Entry<String, Long>> sortedEntries = destinationSaves.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toList());

        for (Map.Entry<String, Long> entry : sortedEntries) {
            String district = entry.getKey();
            Long saves = entry.getValue();
            Map<String, Object> map = new HashMap<>();
            map.put("rank", rank++);
            map.put("place", district);
            map.put("saves", saves);
            
            Double avgRating = destinationRatings.getOrDefault(district, 5.0);
            map.put("rating", Math.round(avgRating * 10.0) / 10.0);
            result.add(map);
        }
        
        // If empty or less than 5, add some mocked ones to fill out
        if (result.isEmpty()) {
            result.add(createDestinationMock(1, "Coorg", 240, 4.8));
            result.add(createDestinationMock(2, "Mysore", 210, 4.7));
            result.add(createDestinationMock(3, "Hampi", 190, 4.9));
            result.add(createDestinationMock(4, "Gokarna", 150, 4.6));
            result.add(createDestinationMock(5, "Chikmagalur", 130, 4.8));
        }
        
        return result;
    }

    private Map<String, Object> createDestinationMock(int rank, String name, int saves, double rating) {
        Map<String, Object> map = new HashMap<>();
        map.put("rank", rank);
        map.put("place", name);
        map.put("saves", saves);
        map.put("rating", rating);
        return map;
    }

    private List<Map<String, Object>> getLiveGrowthData() {
        List<Map<String, Object>> growth = new ArrayList<>();
        List<Travel_planApi.PlanApi.Entity.Registor> users = userRepository.findAll();
        
        Map<String, Long> monthCounts = new LinkedHashMap<>();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM");
        
        for (Travel_planApi.PlanApi.Entity.Registor user : users) {
            if (user.getJoinedDate() != null) {
                String month = user.getJoinedDate().format(formatter);
                monthCounts.put(month, monthCounts.getOrDefault(month, 0L) + 1);
            }
        }
        
        if (monthCounts.isEmpty()) {
            String[] defaultMonths = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"};
            for (String m : defaultMonths) {
                Map<String, Object> map = new HashMap<>();
                map.put("month", m);
                map.put("users", 0);
                growth.add(map);
            }
        } else {
            long cumulative = 0;
            for (Map.Entry<String, Long> entry : monthCounts.entrySet()) {
                cumulative += entry.getValue();
                Map<String, Object> map = new HashMap<>();
                map.put("month", entry.getKey());
                map.put("users", cumulative);
                growth.add(map);
            }
        }
        return growth;
    }

    private List<Map<String, Object>> getMockedMoodData() {
        List<Map<String, Object>> moods = new ArrayList<>();
        moods.add(Map.of("mood", "Adventure", "usage", 34));
        moods.add(Map.of("mood", "Romantic", "usage", 25));
        moods.add(Map.of("mood", "Relaxed", "usage", 20));
        moods.add(Map.of("mood", "Family", "usage", 15));
        moods.add(Map.of("mood", "Solo", "usage", 6));
        return moods;
    }

    private Map<String, Object> getMockedEngagementData() {
        Map<String, Object> engagement = new HashMap<>();
        engagement.put("avgSessionTime", "12 min");
        engagement.put("returnRate", "67%");
        engagement.put("reviewsPerUser", "2.1");
        engagement.put("savedTripsPerUser", "4.3");
        engagement.put("aiGuideQueries", "1,240");
        return engagement;
    }

    private Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("databaseStatus", "Healthy");
        health.put("apiStatus", "Online");
        health.put("totalDistricts", 31);
        health.put("totalImages", placeRepository.count()); 
        return health;
    }
}
