package Travel_planApi.PlanApi.dto;

import java.time.LocalDate;

public class BudgetRequestDto {
    private String source;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private int adults;
    private int children;
    private int seniors;
    private String budgetLevel;
    private String transportMode;

    public BudgetRequestDto() {}

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public int getAdults() { return adults; }
    public void setAdults(int adults) { this.adults = adults; }
    
    public int getChildren() { return children; }
    public void setChildren(int children) { this.children = children; }
    
    public int getSeniors() { return seniors; }
    public void setSeniors(int seniors) { this.seniors = seniors; }
    
    public String getBudgetLevel() { return budgetLevel; }
    public void setBudgetLevel(String budgetLevel) { this.budgetLevel = budgetLevel; }
    
    public String getTransportMode() { return transportMode; }
    public void setTransportMode(String transportMode) { this.transportMode = transportMode; }
}
