package next.galym_community.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import jakarta.validation.ValidationException;
import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class AuthServiceTest {
    @Autowired private UserService userService;

    @Autowired private AuthService authService;

    @Test
    void registeringWithDuplicateEmailThrows() {
        var request = new RegisterRequest("First User", "duplicate@test.com", "password123");
        userService.register(request);

        var duplicateRequest =
                new RegisterRequest("Second User", "duplicate@test.com", "differentPassword");

        assertThrows(ValidationException.class, () -> userService.register(duplicateRequest));
    }

    @Test
    void emailCaseAndSurroundingSpacesDoNotMatter() {
        userService.register(new RegisterRequest("Mixed", "Mixed.Case@Test.com", "password123"));

        assertDoesNotThrow(
                () -> authService.login(new LoginRequest(" mixed.case@test.COM ", "password123")));
        assertThrows(
                ValidationException.class,
                () ->
                        userService.register(
                                new RegisterRequest("Twin", "MIXED.CASE@test.com", "password123")));
    }

    @Test
    void passwordLongerThanBcryptCanHashIsRejectedNotCrashed() {
        // 40 Cyrillic letters: within the 72-character limit, but 80 bytes.
        var request = new RegisterRequest("Long", "longpw@test.com", "п".repeat(40));

        assertThrows(ValidationException.class, () -> userService.register(request));
    }

    @Test
    void wrongPasswordThrows() {
        var request = new RegisterRequest("First User", "wrongPassword@test.com", "password123");
        userService.register(request);

        var wrongPasswordRequest = new LoginRequest("wrongPassword@test.com", "1234password");
        assertThrows(BadCredentialsException.class, () -> authService.login(wrongPasswordRequest));
    }

    @Test
    void loginWithNonexistentEmailThrows() {
        var request = new LoginRequest("doesnotexist@test.com", "anyPassword");
        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
