package next.galym_community.service;

import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.entity.UserEntity;
import next.galym_community.repository.UserRepository;
import next.galym_community.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(LoginRequest request) {
        // Same answer for an unknown email and a wrong password, so the response
        // does not reveal which accounts exist.
        UserEntity user =
                userRepository
                        .findByEmail(request.email())
                        .filter(
                                u ->
                                        passwordEncoder.matches(
                                                request.password(), u.getPasswordHash()))
                        .orElseThrow(
                                () -> new BadCredentialsException("Invalid email or password"));
        UserDetails userDetails =
                User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash())
                        .roles(user.getRole().name())
                        .build();
        return jwtService.generateToken(userDetails);
    }
}
