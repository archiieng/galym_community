package next.galym_community.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Galym")
public class GalymEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @Enumerated(EnumType.STRING)
    private GalymType type;

    @NotBlank
    private String country;
    @NotBlank
    private String city;
    @NotBlank
    private String organizationName;

    @NotBlank
    private String eligibility;
    @NotBlank
    private String applicationInstructions;
    @Future
    private LocalDate applicationDeadline;

    @NotBlank
    private String fundingInfo;
    private boolean hasScholarship;
    private String applicationLink;

    @Enumerated(EnumType.STRING)
    private GalymStatus status;

    private Long createdByUserId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GalymEntity() {}

    public GalymEntity(Long id,
                       String title,
                       String description,
                       GalymType type,
                       String country,
                       String city,
                       String organizationName,
                       String eligibility,
                       String applicationInstructions,
                       LocalDate applicationDeadline,
                       String fundingInfo,
                       boolean hasScholarship,
                       String applicationLink,
                       GalymStatus status,
                       Long createdByUserId,
                       LocalDateTime createdAt,
                       LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.country = country;
        this.city = city;
        this.organizationName = organizationName;
        this.eligibility = eligibility;
        this.applicationInstructions = applicationInstructions;
        this.applicationDeadline = applicationDeadline;
        this.fundingInfo = fundingInfo;
        this.hasScholarship = hasScholarship;
        this.applicationLink = applicationLink;
        this.status = status;
        this.createdByUserId = createdByUserId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public GalymType getType() {
        return type;
    }

    public void setType(GalymType type) {
        this.type = type;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getApplicationInstructions() {
        return applicationInstructions;
    }

    public void setApplicationInstructions(String applicationInstructions) {
        this.applicationInstructions = applicationInstructions;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public String getFundingInfo() {
        return fundingInfo;
    }

    public void setFundingInfo(String fundingInfo) {
        this.fundingInfo = fundingInfo;
    }

    public boolean isHasScholarship() {
        return hasScholarship;
    }

    public void setHasScholarship(boolean hasScholarship) {
        this.hasScholarship = hasScholarship;
    }

    public String getApplicationLink() {
        return applicationLink;
    }

    public void setApplicationLink(String applicationLink) {
        this.applicationLink = applicationLink;
    }

    public GalymStatus getStatus() {
        return status;
    }

    public void setStatus(GalymStatus status) {
        this.status = status;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
