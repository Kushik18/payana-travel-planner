package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "platform_settings")
public class PlatformSetting {
    
    @Id
    private Long id = 1L;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String settingsJson;

    public PlatformSetting() {}

    public PlatformSetting(Long id, String settingsJson) {
        this.id = id;
        this.settingsJson = settingsJson;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSettingsJson() {
        return settingsJson;
    }

    public void setSettingsJson(String settingsJson) {
        this.settingsJson = settingsJson;
    }
}
