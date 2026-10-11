package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "destination_rules")
public class DestinationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String district;
    private String itemId;
    private String priority;
    private String reason;

}
