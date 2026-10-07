package next.galym_community.controller;

import jakarta.validation.Valid;
import next.galym_community.dto.UserResponse;
import next.galym_community.dto.login_and_register.AuthResponse;
import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.service.AuthService;
import next.galym_community.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody @Valid RegisterRequest request) {
        var response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        String token = authService.login(request);
        AuthResponse response = new AuthResponse(token);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }
}
