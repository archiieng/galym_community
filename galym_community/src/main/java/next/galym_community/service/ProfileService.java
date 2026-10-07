package next.galym_community.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import java.util.List;
import next.galym_community.dto.GalymResponse;
import next.galym_community.dto.UserResponse;
import next.galym_community.entity.GalymEntity;
import next.galym_community.entity.UserEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.repository.GalymRepository;
import next.galym_community.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Everything a signed-in user can do with their own account. */
@Service
@Transactional
public class ProfileService {
    private final UserRepository userRepository;
    private final GalymRepository galymRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(
            UserRepository userRepository,
            GalymRepository galymRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.galymRepository = galymRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getProfile(String email) {
        return UserResponse.from(find(email));
    }

    public UserResponse updateName(String email, String name) {
        UserEntity user = find(email);
        user.setName(name.trim());
        return UserResponse.from(user);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        UserEntity user = find(email);
        // A 400, not a 401: the session is fine, only this form's input is wrong.
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ValidationException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
    }

    public List<GalymResponse> getSaved(String email) {
        return find(email).getSavedGalyms().stream()
                .filter(ProfileService::isPublished)
                .map(GalymResponse::from)
                .toList();
    }

    public void save(String email, Long galymId) {
        GalymEntity galym =
                galymRepository
                        .findById(galymId)
                        .filter(ProfileService::isPublished)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Galym not found with this id=" + galymId));
        find(email).getSavedGalyms().add(galym);
    }

    public void unsave(String email, Long galymId) {
        find(email).getSavedGalyms().removeIf(galym -> galym.getId().equals(galymId));
    }

    private UserEntity find(String email) {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private static boolean isPublished(GalymEntity galym) {
        return GalymStatus.PUBLISHED.equals(galym.getStatus());
    }
}
