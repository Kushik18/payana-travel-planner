package Travel_planApi.PlanApi.service;

import Travel_planApi.PlanApi.Entity.Review;
import Travel_planApi.PlanApi.Repository.ReviewRepository;
import Travel_planApi.PlanApi.Repository.TripPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewAdminService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TripPlaceRepository tripPlaceRepository;

    @PostConstruct
    public void seedDataIfEmpty() {
        if (reviewRepository.count() <= 7) {
            reviewRepository.deleteAll();
            List<Travel_planApi.PlanApi.Entity.TripPlace> tripPlaces = tripPlaceRepository.findAll();
            List<Review> initialReviews = new ArrayList<>();
            for (Travel_planApi.PlanApi.Entity.TripPlace tp : tripPlaces) {
                if (tp.getReview() != null && !tp.getReview().trim().isEmpty()) {
                    Review r = new Review();
                    r.setUser(tp.getUser() != null ? tp.getUser() : "Anonymous");
                    r.setDestination(tp.getDistrict() != null ? tp.getDistrict() : "Unknown");
                    r.setRating(tp.getRating() != null ? tp.getRating() : 5);
                    r.setReviewText(tp.getReview());
                    r.setReviewStatus("PENDING");
                    r.setFlagged(false);
                    r.setCreatedAt(LocalDateTime.now());
                    initialReviews.add(r);
                }
            }
            if (!initialReviews.isEmpty()) {
                reviewRepository.saveAll(initialReviews);
            }
        }
    }

    public Map<String, Object> getStats() {
        List<Review> allReviews = reviewRepository.findAll();
        
        long total = allReviews.size();
        long approved = allReviews.stream().filter(r -> "APPROVED".equals(r.getEffectiveStatus())).count();
        long pending = allReviews.stream().filter(r -> "PENDING".equals(r.getEffectiveStatus())).count();
        long flagged = allReviews.stream().filter(r -> r.getFlagged() != null && r.getFlagged()).count();
        
        double avgRating = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        
        // Rating Distribution
        Map<Integer, Long> distribution = allReviews.stream().collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));
        List<Map<String, Object>> ratingDist = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", i + " Star");
            long count = distribution.getOrDefault(i, 0L);
            map.put("value", total > 0 ? (count * 100 / total) : 0);
            ratingDist.add(map);
        }

        // Destination Analytics
        Map<String, List<Review>> destMap = allReviews.stream().collect(Collectors.groupingBy(Review::getDestination));
        List<Map<String, Object>> destAnalytics = new ArrayList<>();
        destMap.forEach((dest, revs) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("destination", dest);
            map.put("reviews", revs.size());
            map.put("avgRating", Math.round(revs.stream().mapToInt(Review::getRating).average().orElse(0.0) * 10.0) / 10.0);
            map.put("trend", Math.random() > 0.5 ? "↑" : "↓");
            destAnalytics.add(map);
        });
        destAnalytics.sort((m1, m2) -> Integer.compare((Integer) m2.get("reviews"), (Integer) m1.get("reviews")));

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("avgRating", Math.round(avgRating * 10.0) / 10.0);
        stats.put("approved", approved);
        stats.put("pending", pending);
        stats.put("flagged", flagged);
        stats.put("ratingDistribution", ratingDist);
        stats.put("destinationAnalytics", destAnalytics);
        
        return stats;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getFlaggedReviews() {
        return reviewRepository.findByFlaggedTrue();
    }

    public Review approveReview(Long id) {
        Review r = reviewRepository.findById(id).orElseThrow();
        r.setReviewStatus("APPROVED");
        r.setFlagged(false);
        r.setFlagReason(null);
        return reviewRepository.save(r);
    }

    public Review rejectReview(Long id) {
        Review r = reviewRepository.findById(id).orElseThrow();
        r.setReviewStatus("REJECTED");
        return reviewRepository.save(r);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
