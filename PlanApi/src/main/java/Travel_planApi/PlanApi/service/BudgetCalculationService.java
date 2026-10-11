package Travel_planApi.PlanApi.service;

import Travel_planApi.PlanApi.Entity.*;
import Travel_planApi.PlanApi.Repository.*;
import Travel_planApi.PlanApi.dto.BudgetRequestDto;
import Travel_planApi.PlanApi.dto.BudgetResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class BudgetCalculationService {

    @Autowired private BudgetDestinationRepository destinationRepository;
    @Autowired private BudgetHotelPricingRepository hotelPricingRepository;
    @Autowired private BudgetFoodPricingRepository foodPricingRepository;
    @Autowired private BudgetTransportPricingRepository transportPricingRepository;
    @Autowired private BudgetAttractionRepository attractionRepository;

    public BudgetResponseDto calculateBudget(BudgetRequestDto request) {
        BudgetResponseDto response = new BudgetResponseDto();
        
        long days = 3;
        long nights = 2;
        if (request.getStartDate() != null && request.getEndDate() != null) {
            days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
            nights = days > 1 ? days - 1 : 1;
        }

        String season = determineSeason(request.getStartDate());
        String destName = request.getDestination() != null ? request.getDestination() : "Mysuru";
        String budgetLevel = request.getBudgetLevel() != null ? request.getBudgetLevel() : "mid-range";
        
        BudgetDestination destination = destinationRepository.findByNameIgnoreCase(destName)
                .orElse(new BudgetDestination()); 
        Long destId = destination.getId() != null ? destination.getId() : 1L;

        // 1. Accommodation
        BudgetHotelPricing hotelPricing = hotelPricingRepository
                .findByDestinationIdAndBudgetLevelIgnoreCaseAndSeasonIgnoreCase(destId, budgetLevel, season)
                .orElse(getDefaultHotelPricing(budgetLevel));
        
        int adults = request.getAdults() > 0 ? request.getAdults() : 2;
        int children = request.getChildren();
        int seniors = request.getSeniors();
        
        int adultsAndSeniors = adults + seniors;
        int roomsRequired = (int) Math.ceil(adultsAndSeniors / 2.0);
        if (roomsRequired == 0) roomsRequired = 1;
        
        double accommodationCost = roomsRequired * hotelPricing.getPricePerNight() * nights;
        
        // 2. Food
        BudgetFoodPricing foodPricing = foodPricingRepository
                .findByDestinationIdAndBudgetLevelIgnoreCase(destId, budgetLevel)
                .orElse(getDefaultFoodPricing(budgetLevel));
        
        double equivalentAdultsFood = adults + seniors + (children * 0.5);
        double foodCost = equivalentAdultsFood * foodPricing.getPricePerPersonDay() * days;
        
        // 3. Transport
        String source = request.getSource() != null ? request.getSource() : "Bangalore";
        String mode = request.getTransportMode() != null ? request.getTransportMode() : "KSRTC Bus";
        BudgetTransportPricing transportPricing = transportPricingRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndModeIgnoreCase(source, destName, mode)
                .orElse(getDefaultTransportPricing(mode));
        
        double equivalentAdultsTransport = adults + seniors + (children * 0.75);
        // Assuming Return trip (x2)
        double transportCost = equivalentAdultsTransport * transportPricing.getPrice() * 2;
        
        // 4. Attractions
        List<BudgetAttraction> attractions = attractionRepository.findByDestinationId(destId);
        if (attractions.isEmpty()) {
            attractions = getDefaultAttractions();
        }
        
        double totalEntryFeePerAdult = attractions.stream().mapToDouble(BudgetAttraction::getEntryFee).sum();
        double equivalentAdultsAttraction = adults + (seniors * 0.8) + (children * 0.5);
        double attractionCost = equivalentAdultsAttraction * totalEntryFeePerAdult;
        
        // 5. Miscellaneous
        double subtotal = accommodationCost + foodCost + transportCost + attractionCost;
        double miscCost = subtotal * 0.08;
        
        double totalBudget = subtotal + miscCost;
        int totalTravelers = adults + children + seniors;
        
        // Populate Response
        response.setTotalBudget(totalBudget);
        response.setPerTraveler(totalBudget / totalTravelers);
        response.setPerDay(totalBudget / days);
        response.setPerNight(totalBudget / nights);
        response.setConfidenceScore(92.0);
        
        // Breakdowns
        Map<String, BudgetResponseDto.CategoryBreakdown> breakdown = new HashMap<>();
        breakdown.put("Accommodation", new BudgetResponseDto.CategoryBreakdown(accommodationCost, (accommodationCost/totalBudget)*100, 
            String.format("₹%.0f × %d Rooms × %d Nights", hotelPricing.getPricePerNight(), roomsRequired, nights)));
        
        breakdown.put("Food & Dining", new BudgetResponseDto.CategoryBreakdown(foodCost, (foodCost/totalBudget)*100, 
            String.format("₹%.0f × %.1f People × %d Days", foodPricing.getPricePerPersonDay(), equivalentAdultsFood, days)));
            
        breakdown.put("Transportation", new BudgetResponseDto.CategoryBreakdown(transportCost, (transportCost/totalBudget)*100, 
            String.format("₹%.0f × %.1f People × 2 (Return)", transportPricing.getPrice(), equivalentAdultsTransport)));
            
        breakdown.put("Entry Fees", new BudgetResponseDto.CategoryBreakdown(attractionCost, (attractionCost/totalBudget)*100, 
            String.format("₹%.0f × %.1f People", totalEntryFeePerAdult, equivalentAdultsAttraction)));
            
        breakdown.put("Miscellaneous", new BudgetResponseDto.CategoryBreakdown(miscCost, (miscCost/totalBudget)*100, 
            "8% of Subtotal"));
            
        response.setCategoryBreakdown(breakdown);
        
        // Daily Spending (Mock distribution)
        List<BudgetResponseDto.DailySpending> daily = new ArrayList<>();
        double avgDaily = totalBudget / days;
        for (int i=1; i<=days; i++) {
            double fluctuation = avgDaily * (0.9 + (Math.random() * 0.2));
            daily.add(new BudgetResponseDto.DailySpending("Day " + i, fluctuation));
        }
        response.setDailySpending(daily);
        
        // AI Recommendations
        List<String> recommendations = new ArrayList<>();
        recommendations.add("You can save ₹" + Math.round(hotelPricing.getPricePerNight() * 0.2) + " by choosing a slightly lower rated hotel.");
        if (mode.contains("Taxi") || mode.contains("Car")) {
            recommendations.add("Consider taking the KSRTC Bus instead of a Taxi to save on transport costs.");
        }
        response.setAiRecommendations(recommendations);
        
        // Budget Health
        Map<String, String> health = new HashMap<>();
        health.put("Accommodation", "Good");
        health.put("Food", "Average");
        health.put("Transport", "Excellent");
        response.setBudgetHealth(health);
        
        // Nearby Alternatives (Mock)
        List<BudgetResponseDto.AlternativeDestination> alt = new ArrayList<>();
        alt.add(new BudgetResponseDto.AlternativeDestination("Coorg", totalBudget * 1.15));
        alt.add(new BudgetResponseDto.AlternativeDestination("Hassan", totalBudget * 0.8));
        response.setNearbyAlternatives(alt);
        
        return response;
    }

    private String determineSeason(LocalDate startDate) {
        if (startDate == null) return "Normal";
        Month month = startDate.getMonth();
        if (month == Month.DECEMBER || month == Month.JANUARY || month == Month.MAY) return "Peak";
        if (month == Month.JUNE || month == Month.JULY) return "Off-Season";
        return "Normal";
    }

    // Default Generators (Mock Data if DB is empty)
    private BudgetHotelPricing getDefaultHotelPricing(String level) {
        BudgetHotelPricing p = new BudgetHotelPricing();
        p.setPricePerNight(level.equalsIgnoreCase("luxury") ? 8500.0 : level.equalsIgnoreCase("mid-range") ? 2400.0 : 900.0);
        return p;
    }
    
    private BudgetFoodPricing getDefaultFoodPricing(String level) {
        BudgetFoodPricing p = new BudgetFoodPricing();
        p.setPricePerPersonDay(level.equalsIgnoreCase("luxury") ? 1800.0 : level.equalsIgnoreCase("mid-range") ? 650.0 : 350.0);
        return p;
    }
    
    private BudgetTransportPricing getDefaultTransportPricing(String mode) {
        BudgetTransportPricing p = new BudgetTransportPricing();
        p.setPrice(mode.toLowerCase().contains("bus") ? 180.0 : 800.0);
        return p;
    }
    
    private List<BudgetAttraction> getDefaultAttractions() {
        BudgetAttraction a1 = new BudgetAttraction(); a1.setName("Palace"); a1.setEntryFee(100.0);
        BudgetAttraction a2 = new BudgetAttraction(); a2.setName("Zoo"); a2.setEntryFee(200.0);
        return Arrays.asList(a1, a2);
    }
}
