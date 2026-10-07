package next.galym_community.dto;

import next.galym_community.entity.UserEntity;
import next.galym_community.model.enums.RoleGalym;

public record UserResponse(Long id, String name, String email, RoleGalym role) {
    public static UserResponse from(UserEntity entity) {
        return new UserResponse(
                entity.getId(), entity.getName(), entity.getEmail(), entity.getRole());
    }
}
