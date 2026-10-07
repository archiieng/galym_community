package next.galym_community.config;

import jakarta.validation.ValidationException;
import java.nio.charset.StandardCharsets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
    // BCrypt reads at most 72 bytes and the encoder throws beyond that. The limit is in
    // bytes, so a 40-letter Cyrillic password is already too long.
    private static final int BCRYPT_MAX_BYTES = 72;

    @Bean
    public PasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                if (tooLong(rawPassword)) {
                    throw new ValidationException("Password is too long");
                }
                return bcrypt.encode(rawPassword);
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                // No stored hash can belong to a password that could never be set.
                return !tooLong(rawPassword) && bcrypt.matches(rawPassword, encodedPassword);
            }
        };
    }

    private static boolean tooLong(CharSequence password) {
        return password.toString().getBytes(StandardCharsets.UTF_8).length > BCRYPT_MAX_BYTES;
    }
}
