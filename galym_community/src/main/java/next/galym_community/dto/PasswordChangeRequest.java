package next.galym_community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// 72 is the longest password BCrypt reads; anything past it would be silently ignored.
public record PasswordChangeRequest(
        @NotBlank String currentPassword, @NotBlank @Size(min = 8, max = 72) String newPassword) {}
