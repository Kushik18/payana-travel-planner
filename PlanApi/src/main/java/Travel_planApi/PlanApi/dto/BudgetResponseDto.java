package Travel_planApi.PlanApi.dto;

import java.util.List;
import java.util.Map;

public class BudgetResponseDto {
    private Double totalBudget;
    private Double perTraveler;
    private Double perDay;
    private Double perNight;
    private Double confidenceScore;

    private Map<String, CategoryBreakdown> categoryBreakdown;
    private List<DailySpending> dailySpending;
    private List<String> aiRecommendations;
    private List<AlternativeDestination> nearbyAlternatives;
    private Map<String, String> budgetHealth; // e.g. "Accommodation" -> "Good"

    public BudgetResponseDto() {}

    // Inner classes for structured response
    public static class CategoryBreakdown {
        private Double totalAmount;
        private Double percentage;
        private String formula;

        public CategoryBreakdown(Double totalAmount, Double percentage, String formula) {
            this.totalAmount = totalAmount;
            this.percentage = percentage;
            this.formula = formula;
        }

        public Double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
        public String getFormula() { return formula; }
        public void setFormula(String formula) { this.formula = formula; }
    }

    public static class DailySpending {
        private String day;
        private Double amount;

        public DailySpending(String day, Double amount) {
            this.day = day;
            this.amount = amount;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    public static class AlternativeDestination {
        private String name;
        private Double estimatedCost;

        public AlternativeDestination(String name, Double estimatedCost) {
            this.name = name;
            this.estimatedCost = estimatedCost;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Double getEstimatedCost() { return estimatedCost; }
        public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
    }

    // Getters and Setters
    public Double getTotalBudget() { return totalBudget; }
    public void setTotalBudget(Double totalBudget) { this.totalBudget = totalBudget; }
    
    public Double getPerTraveler() { return perTraveler; }
    public void setPerTraveler(Double perTraveler) { this.perTraveler = perTraveler; }
    
    public Double getPerDay() { return perDay; }
    public void setPerDay(Double perDay) { this.perDay = perDay; }
    
    public Double getPerNight() { return perNight; }
    public void setPerNight(Double perNight) { this.perNight = perNight; }
    
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public Map<String, CategoryBreakdown> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(Map<String, CategoryBreakdown> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }
    
    public List<DailySpending> getDailySpending() { return dailySpending; }
    public void setDailySpending(List<DailySpending> dailySpending) { this.dailySpending = dailySpending; }
    
    public List<String> getAiRecommendations() { return aiRecommendations; }
    public void setAiRecommendations(List<String> aiRecommendations) { this.aiRecommendations = aiRecommendations; }
    
    public List<AlternativeDestination> getNearbyAlternatives() { return nearbyAlternatives; }
    public void setNearbyAlternatives(List<AlternativeDestination> nearbyAlternatives) { this.nearbyAlternatives = nearbyAlternatives; }
    
    public Map<String, String> getBudgetHealth() { return budgetHealth; }
    public void setBudgetHealth(Map<String, String> budgetHealth) { this.budgetHealth = budgetHealth; }
}
