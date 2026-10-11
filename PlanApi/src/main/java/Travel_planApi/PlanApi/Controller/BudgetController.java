package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.dto.BudgetRequestDto;
import Travel_planApi.PlanApi.dto.BudgetResponseDto;
import Travel_planApi.PlanApi.service.BudgetCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:3000") // Assuming React runs on 3000
public class BudgetController {

    @Autowired
    private BudgetCalculationService calculationService;

    @PostMapping("/calculate")
    public ResponseEntity<BudgetResponseDto> calculateBudget(@RequestBody BudgetRequestDto request) {
        BudgetResponseDto response = calculationService.calculateBudget(request);
        return ResponseEntity.ok(response);
    }
}
