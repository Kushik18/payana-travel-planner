package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAuthority('ADMIN')")
public class SystemSettingsController {

    @Autowired
    private SystemSettingsService systemSettingsService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSettings() {
        return ResponseEntity.ok(systemSettingsService.getSettingsDashboard());
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, String> payload) {
        String settingsJson = payload.get("settingsJson");
        if (settingsJson != null) {
            systemSettingsService.updateSettings(settingsJson);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/backup")
    public ResponseEntity<?> triggerBackup() {
        // Mock execution
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return ResponseEntity.ok(Map.of("message", "Backup Completed Successfully"));
    }

    @PostMapping("/cache-clear")
    public ResponseEntity<?> clearCache() {
        // Mock execution
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return ResponseEntity.ok(Map.of("message", "Cache Cleared Successfully"));
    }
}
