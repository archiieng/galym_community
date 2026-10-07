package next.galym_community.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import next.galym_community.model.enums.GalymType;

// The short fields are varchar(255) columns; the long ones are text.
public record GalymRequest(
        @NotBlank @Size(max = 255) String title,
        @NotBlank String description,
        @NotNull GalymType type,
        @NotBlank @Size(max = 255) String country,
        @NotBlank @Size(max = 255) String city,
        @NotBlank @Size(max = 255) String organizationName,
        @NotBlank String eligibility,
        @NotBlank String applicationInstructions,
        // Today still counts: the public list shows an opportunity through its last day.
        @NotNull @FutureOrPresent LocalDate applicationDeadline,
        @NotBlank String fundingInfo,
        boolean hasScholarship,
        // Rendered as a link, so nothing but web addresses (no javascript: and the like).
        @Pattern(regexp = "^(https?://\\S+)?$", message = "must start with http:// or https://")
                String applicationLink) {}
