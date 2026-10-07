package next.galym_community.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import next.galym_community.model.enums.RoleGalym;

public record UserUpdateRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotNull RoleGalym role) {}
