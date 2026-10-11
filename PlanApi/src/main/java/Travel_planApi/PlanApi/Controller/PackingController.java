package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.Entity.PackingItem;
import Travel_planApi.PlanApi.Repository.PackingItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packing")
@CrossOrigin(origins = "http://localhost:3000")
public class PackingController {

    @Autowired
    private PackingItemRepository packingItemRepository;

    @GetMapping("/items")
    public ResponseEntity<List<PackingItem>> getAllPackingItems() {
        return ResponseEntity.ok(packingItemRepository.findAll());
    }
}
