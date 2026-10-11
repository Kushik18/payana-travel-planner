package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.BudgetDestination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetDestinationRepository extends JpaRepository<BudgetDestination, Long> {
    Optional<BudgetDestination> findByNameIgnoreCase(String name);
}
