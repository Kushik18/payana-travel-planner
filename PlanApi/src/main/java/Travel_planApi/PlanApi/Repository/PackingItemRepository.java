package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.PackingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackingItemRepository extends JpaRepository<PackingItem, Long> {
}
