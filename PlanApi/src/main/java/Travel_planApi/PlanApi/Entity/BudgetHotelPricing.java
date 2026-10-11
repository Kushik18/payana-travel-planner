package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budget_hotel_pricing")
public class BudgetHotelPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long destinationId;
    private String budgetLevel; // backpacker, budget, mid-range, premium, luxury
    private Double pricePerNight;
    private Double rating;
    private String season; // peak, normal, off-season

    public BudgetHotelPricing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDestinationId() { return destinationId; }
    public void setDestinationId(Long destinationId) { this.destinationId = destinationId; }

    public String getBudgetLevel() { return budgetLevel; }
    public void setBudgetLevel(String budgetLevel) { this.budgetLevel = budgetLevel; }

    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
}
