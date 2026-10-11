package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "packing_items")
public class PackingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category; // Essentials, Clothing, etc.
    private String defaultPriority; // Mandatory, Recommended, Optional
    private Integer weightGrams; // Weight in grams
    private String tags; // Comma separated tags for search

}
