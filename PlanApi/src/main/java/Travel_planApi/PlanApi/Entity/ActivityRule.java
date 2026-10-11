package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "activity_rules")
public class ActivityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String activity;
    private String itemId;
    private String priority;

}
