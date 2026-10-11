package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.Entity.Festival;
import Travel_planApi.PlanApi.Repository.FestivalRepository;
import Travel_planApi.PlanApi.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/festivals")
public class FestivalController {

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private SystemSettingsService systemSettingsService;

    @GetMapping("/all")
    public ResponseEntity<List<Festival>> getAll() {
        if (!systemSettingsService.isShowFestivals()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(festivalRepository.findAll());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<Festival>> getByDistrict(@PathVariable String district) {
        if (!systemSettingsService.isShowFestivals()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(festivalRepository.findByDistrict(district));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Festival>> getUpcoming() {
        if (!systemSettingsService.isShowFestivals()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        LocalDate today = LocalDate.now();
        LocalDate threeMonths = today.plusMonths(3);
        return ResponseEntity.ok(festivalRepository.findFestivalsInDateRange(today, threeMonths));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Festival>> getInRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        if (!systemSettingsService.isShowFestivals()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(festivalRepository.findFestivalsInDateRange(
                LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }

    /* Admin-only: seed / create festivals */
    @PostMapping("/create")
    public ResponseEntity<Festival> create(@RequestBody Festival festival) {
        return ResponseEntity.ok(festivalRepository.save(festival));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Festival> update(@PathVariable Long id, @RequestBody Festival festival) {
        festival.setId(id);
        return ResponseEntity.ok(festivalRepository.save(festival));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        festivalRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Festival deleted"));
    }
}
