package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.Entity.Review;
import Travel_planApi.PlanApi.service.ReviewAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reviews")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAuthority('ADMIN')")
public class ReviewAdminController {

    @Autowired
    private ReviewAdminService reviewAdminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(reviewAdminService.getStats());
    }

    @GetMapping("")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewAdminService.getAllReviews());
    }

    @GetMapping("/flagged")
    public ResponseEntity<List<Review>> getFlaggedReviews() {
        return ResponseEntity.ok(reviewAdminService.getFlaggedReviews());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewAdminService.approveReview(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Review> rejectReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewAdminService.rejectReview(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewAdminService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
}
