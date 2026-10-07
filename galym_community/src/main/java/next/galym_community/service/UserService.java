package next.galym_community.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.dto.UserResponse;
import next.galym_community.entity.UserEntity;
import next.galym_community.model.enums.RoleGalym;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import next.galym_community.repository.UserRepository;
import java.util.List;


@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    public UserService(
            UserRepository repository,
            PasswordEncoder passwordEncoder
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getUserById(Long id) {
        var user = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User by id " + id + " does not exist"));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
    public UserResponse getUserByEmail(String email) {
        var user = repository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return UserResponse.from(user);
    }

    public List<UserResponse> findAllUser() {
        List<UserEntity> allUsers = repository.findAll();
        return allUsers.stream()
                .map(it ->new UserResponse(
                        it.getId(),
                        it.getName(),
                        it.getEmail(),
                        it.getRole()

                )).toList();
    }

    public UserResponse updateUser(Long id, @Valid UserEntity userToUpdate) {
        var UserUpdated =repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User by id " + id + " does not exist"));
        if(userToUpdate.getName() == null || userToUpdate.getName().isEmpty()){
            throw new ValidationException("Name is empty");
        }
        if(userToUpdate.getEmail() == null || userToUpdate.getEmail().isEmpty()){
            throw new ValidationException("Email is empty");
        }
        if(userToUpdate.getPasswordHash() == null || userToUpdate.getPasswordHash().isEmpty()){
            throw new ValidationException("Password is empty");
        }
        if(userToUpdate.getRole() == null){
            throw new ValidationException("Role is empty");
        }
        var entityToSave = new  UserEntity(
                UserUpdated.getId(),
                userToUpdate.getName(),
                userToUpdate.getEmail(),
                passwordEncoder.encode(userToUpdate.getPasswordHash()),
                userToUpdate.getRole()
        );
        UserEntity  savedUser = repository.save(entityToSave);
        return new UserResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public void dropppedUser(Long id) {
        var user = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User by id " + id + " does not exist"));
        repository.delete(user);
    }

    public UserResponse register(RegisterRequest request) {
        if(request.name() == null || request.name().isEmpty()){
            throw new ValidationException("Name is empty");
        }
        if(request.email() == null || request.email().isEmpty()) {
            throw new ValidationException("Email is empty");
        }
        if(request.password() == null || request.password().isEmpty()){
            throw new ValidationException("Password is empty");
        }
        if(repository.existsByEmail(request.email())){
            throw new ValidationException("Email already exists");
        }
        var entity = new UserEntity(
                null,
                request.name(),
                request.email(),
                passwordEncoder.encode(request.password()),
                RoleGalym.USER
        );
        UserEntity savedUser = repository.save(entity);
        return UserResponse.from(savedUser);
    }
}
