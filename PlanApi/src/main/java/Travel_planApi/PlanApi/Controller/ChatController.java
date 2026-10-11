package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.Entity.ChatHistory;
import Travel_planApi.PlanApi.Repository.ChatHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private Travel_planApi.PlanApi.service.FoursquareService foursquareService;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    /**
     * Send a message to the AI travel guide.
     * Body: { "userId": "user@email.com", "message": "Best places in Coorg?" }
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String message = request.get("message");

        if (userId == null || userId.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId and message are required"));
        }

        // Call Foursquare API
        java.util.List<Travel_planApi.PlanApi.Entity.Itinerary> places = foursquareService.searchPlaces(message, null);
        StringBuilder aiResponseBuilder = new StringBuilder("Here are some places in Karnataka matching your search:\\n\\n");
        if (places.isEmpty()) {
            aiResponseBuilder.append("I couldn't find anything matching that description. Try asking about temples, waterfalls, or parks!");
        } else {
            for (Travel_planApi.PlanApi.Entity.Itinerary place : places) {
                aiResponseBuilder.append("**").append(place.getPlace()).append("**\\n");
                if (place.getDescription() != null) {
                    aiResponseBuilder.append("📍 ").append(place.getDescription()).append("\\n");
                }
                if (place.getCategory() != null) {
                    aiResponseBuilder.append("🏷️ ").append(place.getCategory()).append("\\n");
                }
                aiResponseBuilder.append("\\n");
            }
        }
        String aiResponse = aiResponseBuilder.toString();

        // Persist to chat_history table
        ChatHistory history = new ChatHistory();
        history.setUserId(userId);
        history.setMessage(message);
        history.setResponse(aiResponse);
        chatHistoryRepository.save(history);

        return ResponseEntity.ok(Map.of(
            "message", message,
            "response", aiResponse
        ));
    }

    /**
     * Get all chat history for a user.
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatHistory>> getHistory(@PathVariable String userId) {
        List<ChatHistory> history = chatHistoryRepository.findByUserIdOrderByTimestampAsc(userId);
        return ResponseEntity.ok(history);
    }

    /**
     * Clear chat history for a user.
     */
    @DeleteMapping("/history/{userId}")
    public ResponseEntity<Map<String, String>> clearHistory(@PathVariable String userId) {
        List<ChatHistory> history = chatHistoryRepository.findByUserIdOrderByTimestampAsc(userId);
        chatHistoryRepository.deleteAll(history);
        return ResponseEntity.ok(Map.of("message", "Chat history cleared successfully"));
    }
}
