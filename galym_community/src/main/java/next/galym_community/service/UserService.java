package next.galym_community.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import java.util.List;
import next.galym_community.dto.UserResponse;
import next.galym_community.dto.UserUpdateRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.entity.UserEntity;
import next.galym_community.model.enums.RoleGalym;
import next.galym_community.repository.UserRepository;
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
        List<UserEntity> allUsers = repository.findAll();
        return allUsers.stream()
                .map(it -> new UserResponse(it.getId(), it.getName(), it.getEmail(), it.getRole()))
                .toList();
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        var user =
                repository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "User by id " + id + " does not exist"));
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        return UserResponse.from(repository.save(user));
    }

    public void dropppedUser(Long id) {
        var user =
                repository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "User by id " + id + " does not exist"));
        repository.delete(user);
    }

    public UserResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new ValidationException("Email already exists");
        }
        var entity =
                new UserEntity(
                        null,
                        request.name(),
                        request.email(),
                        passwordEncoder.encode(request.password()),
                        RoleGalym.USER);
        UserEntity savedUser = repository.save(entity);
        return UserResponse.from(savedUser);
    }
}
