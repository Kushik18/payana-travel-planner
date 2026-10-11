package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.Entity.HiddenGem;
import Travel_planApi.PlanApi.Repository.HiddenGemRepository;
import Travel_planApi.PlanApi.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/hidden-gems")
public class HiddenGemController {

    @Autowired
    private HiddenGemRepository hiddenGemRepository;

    @Autowired
    private SystemSettingsService systemSettingsService;

    @GetMapping("/all")
    public ResponseEntity<List<HiddenGem>> getAll() {
        if (!systemSettingsService.isShowHiddenGems()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(hiddenGemRepository.findAll());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<HiddenGem>> getByDistrict(@PathVariable String district) {
        if (!systemSettingsService.isShowHiddenGems()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(hiddenGemRepository.findByDistrict(district));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<HiddenGem>> getByCategory(@PathVariable String category) {
        if (!systemSettingsService.isShowHiddenGems()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(hiddenGemRepository.findByCategory(category));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<HiddenGem>> filter(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category) {
        if (!systemSettingsService.isShowHiddenGems()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        if (district != null && category != null) {
            return ResponseEntity.ok(hiddenGemRepository.findByDistrictAndCategory(district, category));
        } else if (district != null) {
            return ResponseEntity.ok(hiddenGemRepository.findByDistrict(district));
        } else if (category != null) {
            return ResponseEntity.ok(hiddenGemRepository.findByCategory(category));
        }
        return ResponseEntity.ok(hiddenGemRepository.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<HiddenGem> create(@RequestBody HiddenGem gem) {
        return ResponseEntity.ok(hiddenGemRepository.save(gem));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<HiddenGem> update(@PathVariable Long id, @RequestBody HiddenGem gem) {
        gem.setId(id);
        return ResponseEntity.ok(hiddenGemRepository.save(gem));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        hiddenGemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Gem deleted"));
    }
}
