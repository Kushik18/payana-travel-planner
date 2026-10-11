package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budget_food_pricing")
public class BudgetFoodPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long destinationId;
    private String budgetLevel;
    private Double pricePerPersonDay;

    public BudgetFoodPricing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDestinationId() { return destinationId; }
    public void setDestinationId(Long destinationId) { this.destinationId = destinationId; }

    public String getBudgetLevel() { return budgetLevel; }
    public void setBudgetLevel(String budgetLevel) { this.budgetLevel = budgetLevel; }

    public Double getPricePerPersonDay() { return pricePerPersonDay; }
    public void setPricePerPersonDay(Double pricePerPersonDay) { this.pricePerPersonDay = pricePerPersonDay; }
}
