package next.galym_community.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import next.galym_community.model.enums.GalymType;

public record GalymRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull GalymType type,
        @NotBlank String country,
        @NotBlank String city,
        @NotBlank String organizationName,
        @NotBlank String eligibility,
        @NotBlank String applicationInstructions,
        @NotNull @Future LocalDate applicationDeadline,
        @NotBlank String fundingInfo,
        boolean hasScholarship,
        String applicationLink) {}
