package Travel_planApi.PlanApi.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String user;
    private String destination;
    private Integer rating;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String reviewText;
    
    private String reviewStatus = "PENDING"; // PENDING, APPROVED, REJECTED
    
    private Boolean flagged = false;
    private String flagReason;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public Review() {}

    public Review(Long id, String user, String destination, Integer rating, String reviewText, String reviewStatus, Boolean flagged, String flagReason, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.destination = destination;
        this.rating = rating;
        this.reviewText = reviewText;
        this.reviewStatus = reviewStatus;
        this.flagged = flagged;
        this.flagReason = flagReason;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }

    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }

    public Boolean getFlagged() { return flagged; }
    public void setFlagged(Boolean flagged) { this.flagged = flagged; }

    public String getFlagReason() { return flagReason; }
    public void setFlagReason(String flagReason) { this.flagReason = flagReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getEffectiveStatus() {
        return reviewStatus == null ? "APPROVED" : reviewStatus;
    }
}
