package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.BudgetAttraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetAttractionRepository extends JpaRepository<BudgetAttraction, Long> {
    List<BudgetAttraction> findByDestinationId(Long destinationId);
}
