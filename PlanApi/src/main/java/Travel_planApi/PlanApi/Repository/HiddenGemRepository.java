package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.HiddenGem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HiddenGemRepository extends JpaRepository<HiddenGem, Long> {
    List<HiddenGem> findByDistrict(String district);
    List<HiddenGem> findByCategory(String category);
    List<HiddenGem> findByDistrictAndCategory(String district, String category);
}
