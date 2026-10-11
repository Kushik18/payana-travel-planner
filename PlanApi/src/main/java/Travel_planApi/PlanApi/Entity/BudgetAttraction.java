package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budget_attraction")
public class BudgetAttraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long destinationId;
    private String name;
    private Double entryFee;
    private Integer durationMins;

    public BudgetAttraction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDestinationId() { return destinationId; }
    public void setDestinationId(Long destinationId) { this.destinationId = destinationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getEntryFee() { return entryFee; }
    public void setEntryFee(Double entryFee) { this.entryFee = entryFee; }

    public Integer getDurationMins() { return durationMins; }
    public void setDurationMins(Integer durationMins) { this.durationMins = durationMins; }
}
