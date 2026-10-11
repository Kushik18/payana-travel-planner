package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(reportService.getOverview());
    }

    @PostMapping("/custom")
    public ResponseEntity<Map<String, Object>> getCustomReport(@RequestBody Map<String, String> filters) {
        return ResponseEntity.ok(reportService.getCustomReport(filters));
    }
}
