package next.galym_community.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import java.util.List;
import java.util.Locale;
import next.galym_community.dto.UserResponse;
import next.galym_community.dto.UserUpdateRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.entity.UserEntity;
import next.galym_community.model.enums.RoleGalym;
import next.galym_community.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getUserById(Long id) {
        var user =
                repository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "User by id " + id + " does not exist"));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public List<UserResponse> findAllUser() {
        List<UserEntity> allUsers = repository.findAll(Sort.by("id"));
        return allUsers.stream()
                .map(it -> new UserResponse(it.getId(), it.getName(), it.getEmail(), it.getRole()))
                .toList();
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request, String actingEmail) {
        var user =
                repository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "User by id " + id + " does not exist"));
        // Same rule as changeRole: an admin cannot take their own admin rights away.
        if (user.getEmail().equals(actingEmail) && request.role() != user.getRole()) {
            throw new ValidationException("You cannot change your own role");
        }
        user.setName(request.name());
        user.setEmail(normalize(request.email()));
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        return UserResponse.from(repository.save(user));
    }

    public UserResponse changeRole(Long id, RoleGalym role, String actingEmail) {
        var user = findOtherUser(id, actingEmail, "You cannot change your own role");
        user.setRole(role);
        return UserResponse.from(repository.save(user));
    }

    public void deleteUser(Long id, String actingEmail) {
        repository.delete(findOtherUser(id, actingEmail, "You cannot delete your own account"));
    }

    /** Admins manage everyone but themselves, so the last admin cannot lock the site. */
    private UserEntity findOtherUser(Long id, String actingEmail, String messageIfSelf) {
        var user =
                repository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "User by id " + id + " does not exist"));
        if (user.getEmail().equals(actingEmail)) {
            throw new ValidationException(messageIfSelf);
        }
        return user;
    }

    /** One spelling per address, so "Name@x.com" and "name@x.com" are the same account. */
    static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    public UserResponse register(RegisterRequest request) {
        String email = normalize(request.email());
        if (repository.existsByEmail(email)) {
            throw new ValidationException("Email already exists");
        }
        var entity =
                new UserEntity(
                        null,
                        request.name(),
                        email,
                        passwordEncoder.encode(request.password()),
                        RoleGalym.USER);
        UserEntity savedUser = repository.save(entity);
        return UserResponse.from(savedUser);
    }
}
