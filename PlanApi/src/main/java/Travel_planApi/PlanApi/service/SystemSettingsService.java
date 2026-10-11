package Travel_planApi.PlanApi.service;

import Travel_planApi.PlanApi.Entity.PlatformSetting;
import Travel_planApi.PlanApi.Repository.PlatformSettingRepository;
import Travel_planApi.PlanApi.Repository.RegisterInter;
import Travel_planApi.PlanApi.Repository.TripPlaceRepository;
import Travel_planApi.PlanApi.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
public class SystemSettingsService {

    @Autowired
    private PlatformSettingRepository platformSettingRepository;

    @Autowired
    private RegisterInter registorRepository;

    @Autowired
    private TripPlaceRepository tripPlaceRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    private final String DEFAULT_SETTINGS = "{"
            + "\"general\": {\"platformName\": \"Payana\", \"supportEmail\": \"support@payana.com\", \"defaultLanguage\": \"English\", \"maintenanceMode\": false},"
            + "\"ai\": {\"enableAiTripPlanner\": true, \"enableAiGuide\": true, \"enableHiddenGems\": true, \"enableRouteOptimizer\": false},"
            + "\"registration\": {\"allowRegistration\": true, \"allowReviews\": true, \"allowItinerarySaving\": true, \"maxSavedTrips\": 20},"
            + "\"content\": {\"enableReviewModeration\": true, \"autoApproveReviews\": false, \"showHiddenGems\": true, \"showFestivals\": true},"
            + "\"notifications\": {\"adminAlerts\": true, \"reviewAlerts\": true, \"festivalAlerts\": false, \"userRegistrationAlerts\": false}"
            + "}";

    @PostConstruct
    public void initDefaultSettings() {
        if (platformSettingRepository.findById(1L).isEmpty()) {
            PlatformSetting setting = new PlatformSetting(1L, DEFAULT_SETTINGS);
            platformSettingRepository.save(setting);
        }
    }

    public Map<String, Object> getSettingsDashboard() {
        Map<String, Object> response = new HashMap<>();

        // 1. Fetch Metrics
        Map<String, Object> status = new HashMap<>();
        status.put("users", registorRepository.count());
        status.put("places", tripPlaceRepository.count());
        status.put("reviews", reviewRepository.count());
        status.put("health", "99.9%");
        response.put("status", status);

        // 2. Fetch Settings
        PlatformSetting setting = platformSettingRepository.findById(1L)
                .orElseGet(() -> new PlatformSetting(1L, DEFAULT_SETTINGS));
        response.put("settingsJson", setting.getSettingsJson());

        return response;
    }

    public void updateSettings(String settingsJson) {
        PlatformSetting setting = platformSettingRepository.findById(1L)
                .orElse(new PlatformSetting(1L, DEFAULT_SETTINGS));
        setting.setSettingsJson(settingsJson);
        platformSettingRepository.save(setting);
    }

    private com.fasterxml.jackson.databind.JsonNode getSettingsNode() {
        try {
            PlatformSetting setting = platformSettingRepository.findById(1L)
                    .orElseGet(() -> new PlatformSetting(1L, DEFAULT_SETTINGS));
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.readTree(setting.getSettingsJson());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean isRegistrationAllowed() {
        com.fasterxml.jackson.databind.JsonNode node = getSettingsNode();
        return node != null && node.has("registration") && node.get("registration").has("allowRegistration") 
               ? node.get("registration").get("allowRegistration").asBoolean() : true;
    }

    public boolean isItinerarySavingAllowed() {
        com.fasterxml.jackson.databind.JsonNode node = getSettingsNode();
        return node != null && node.has("registration") && node.get("registration").has("allowItinerarySaving") 
               ? node.get("registration").get("allowItinerarySaving").asBoolean() : true;
    }

    public boolean isShowHiddenGems() {
        com.fasterxml.jackson.databind.JsonNode node = getSettingsNode();
        return node != null && node.has("content") && node.get("content").has("showHiddenGems") 
               ? node.get("content").get("showHiddenGems").asBoolean() : true;
    }

    public boolean isShowFestivals() {
        com.fasterxml.jackson.databind.JsonNode node = getSettingsNode();
        return node != null && node.has("content") && node.get("content").has("showFestivals") 
               ? node.get("content").get("showFestivals").asBoolean() : true;
    }

    public boolean isReviewsAllowed() {
        com.fasterxml.jackson.databind.JsonNode node = getSettingsNode();
        return node != null && node.has("registration") && node.get("registration").has("allowReviews") 
               ? node.get("registration").get("allowReviews").asBoolean() : true;
    }
}
