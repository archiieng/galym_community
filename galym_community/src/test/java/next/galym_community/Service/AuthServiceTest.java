package next.galym_community.Service;

import jakarta.validation.ValidationException;
import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.service.AuthService;
import next.galym_community.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class AuthServiceTest {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Test
    void registeringWithDuplicateEmailThrows(){
        var request = new RegisterRequest("First User", "duplicate@test.com", "password123");
        userService.register(request);

        var duplicateRequest = new RegisterRequest("Second User", "duplicate@test.com", "differentPassword");

        assertThrows(ValidationException.class, () -> {userService.register(duplicateRequest);});
    }

    @Test
    void wrongPasswordThrows(){
        var request = new RegisterRequest("First User", "wrongPassword@test.com", "password123");
        userService.register(request);

        var wrongPasswordRequest = new LoginRequest( "wrongPassword@test.com", "1234password");
        assertThrows(ValidationException.class, () -> authService.login(wrongPasswordRequest));
    }

    @Test
    void loginWithNonexistentEmailThrows(){
        var request = new LoginRequest("doesnotexist@test.com", "anyPassword");
        assertThrows(ValidationException.class, () -> {authService.login(request);});
    }
}
