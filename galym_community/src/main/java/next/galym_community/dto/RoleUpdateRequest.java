package next.galym_community.dto;

import jakarta.validation.constraints.NotNull;
import next.galym_community.model.enums.RoleGalym;

public record RoleUpdateRequest(@NotNull RoleGalym role) {}
