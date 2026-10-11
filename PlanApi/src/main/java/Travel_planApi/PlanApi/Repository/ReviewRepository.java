package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByFlaggedTrue();
    List<Review> findByDestination(String destination);
}
