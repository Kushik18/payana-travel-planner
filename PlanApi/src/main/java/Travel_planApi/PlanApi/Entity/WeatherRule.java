package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "weather_rules")
public class WeatherRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String conditionType; // e.g., TEMP_GREATER_THAN, TEMP_LESS_THAN, RAIN_PROB
    private Double conditionValue;
    private String itemId;
    private String priority;
    private String reason;

}
