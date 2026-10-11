package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FestivalRepository extends JpaRepository<Festival, Long> {
    List<Festival> findByDistrict(String district);

    @Query("SELECT f FROM Festival f WHERE f.startDate <= :endDate AND f.endDate >= :startDate")
    List<Festival> findFestivalsInDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
