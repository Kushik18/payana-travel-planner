package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budget_transport_pricing")
public class BudgetTransportPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;
    private String mode; // KSRTC, Train, Taxi, Flight
    private Double price;
    private Double distance;
    private Integer durationMins;

    public BudgetTransportPricing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public Integer getDurationMins() { return durationMins; }
    public void setDurationMins(Integer durationMins) { this.durationMins = durationMins; }
}
