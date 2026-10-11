package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.Entity.Expense;
import Travel_planApi.PlanApi.Repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    /** GET all expenses for a user */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(expenseRepository.findByUserId(userId));
    }

    /** GET expenses for a specific trip */
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Expense>> getByTrip(
            @PathVariable Long tripId,
            @RequestParam String userId) {
        return ResponseEntity.ok(expenseRepository.findByUserIdAndTripId(userId, tripId));
    }

    /** POST create a new expense */
    @PostMapping("/create")
    public ResponseEntity<Expense> create(@RequestBody Expense expense) {
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(java.time.LocalDate.now());
        }
        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    /** PUT update an existing expense */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Expense updated) {
        return expenseRepository.findById(id).map(existing -> {
            existing.setCategory(updated.getCategory());
            existing.setAmount(updated.getAmount());
            existing.setDescription(updated.getDescription());
            existing.setExpenseDate(updated.getExpenseDate());
            existing.setTripId(updated.getTripId());
            return ResponseEntity.ok(expenseRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** DELETE an expense */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Expense deleted"));
    }

    /**
     * GET category-wise summary for a user.
     * Returns: [{ category, total, count }]
     */
    @GetMapping("/summary/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getSummary(@PathVariable String userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        Map<String, BigDecimal> totals = new LinkedHashMap<>();
        Map<String, Long>       counts = new LinkedHashMap<>();

        for (Expense e : expenses) {
            String cat = e.getCategory() != null ? e.getCategory() : "Other";
            BigDecimal amt = e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO;
            totals.merge(cat, amt, BigDecimal::add);
            counts.merge(cat, 1L, Long::sum);
        }

        List<Map<String, Object>> result = totals.entrySet().stream()
            .map(entry -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("category", entry.getKey());
                m.put("total",    entry.getValue());
                m.put("count",    counts.get(entry.getKey()));
                return m;
            })
            .sorted((a, b) -> ((BigDecimal)b.get("total")).compareTo((BigDecimal)a.get("total")))
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
