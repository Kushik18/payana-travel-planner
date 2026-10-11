package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.BudgetTransportPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetTransportPricingRepository extends JpaRepository<BudgetTransportPricing, Long> {
    Optional<BudgetTransportPricing> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndModeIgnoreCase(String source, String destination, String mode);
}
