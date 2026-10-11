package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.service.RouteOptimizerService;
import Travel_planApi.PlanApi.service.RouteOptimizerService.RouteStop;
import Travel_planApi.PlanApi.service.RouteOptimizerService.OptimizationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/route")
public class RouteOptimizerController {

    @Autowired
    private RouteOptimizerService routeOptimizerService;

    /**
     * POST /api/route/optimize
     * Body: list of stops: [{ "name": "Mysuru", "lat": 12.29, "lon": 76.64, "district": "Mysuru" }, ...]
     */
    @PostMapping("/optimize")
    public ResponseEntity<?> optimize(@RequestBody List<Map<String, Object>> stopsData) {
        if (stopsData == null || stopsData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "At least 2 stops are required"));
        }

        List<RouteStop> stops = stopsData.stream().map(s -> {
            String name     = (String) s.getOrDefault("name", "Unknown");
            String district = (String) s.getOrDefault("district", "");
            double lat = parseDouble(s.get("lat"));
            double lon = parseDouble(s.get("lon"));
            return new RouteStop(name, lat, lon, district);
        }).toList();

        OptimizationResult result = routeOptimizerService.optimize(stops);
        return ResponseEntity.ok(result);
    }

    private double parseDouble(Object val) {
        if (val == null) return 0;
        if (val instanceof Number) return ((Number) val).doubleValue();
        try { return Double.parseDouble(val.toString()); } catch (Exception e) { return 0; }
    }
}
