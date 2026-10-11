package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.BudgetFoodPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetFoodPricingRepository extends JpaRepository<BudgetFoodPricing, Long> {
    Optional<BudgetFoodPricing> findByDestinationIdAndBudgetLevelIgnoreCase(Long destinationId, String budgetLevel);
}
