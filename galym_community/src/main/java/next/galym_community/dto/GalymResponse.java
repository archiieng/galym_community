package next.galym_community.dto;

import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record GalymResponse(
        Long id,
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
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static  GalymResponse from(GalymEntity entity) {
        return new GalymResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getType(),
                entity.getCountry(),
                entity.getCity(),
                entity.getOrganizationName(),
                entity.getEligibility(),
                entity.getApplicationInstructions(),
                entity.getApplicationDeadline(),
                entity.getFundingInfo(),
                entity.isHasScholarship(),
                entity.getApplicationLink(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
