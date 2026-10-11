package Travel_planApi.PlanApi.Repository;

import Travel_planApi.PlanApi.Entity.PlatformSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformSettingRepository extends JpaRepository<PlatformSetting, Long> {
}
