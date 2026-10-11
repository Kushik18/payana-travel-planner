package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.BudgetHotelPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetHotelPricingRepository extends JpaRepository<BudgetHotelPricing, Long> {
    Optional<BudgetHotelPricing> findByDestinationIdAndBudgetLevelIgnoreCaseAndSeasonIgnoreCase(Long destinationId, String budgetLevel, String season);
}
