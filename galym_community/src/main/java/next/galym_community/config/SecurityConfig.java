package next.galym_community.config;

import jakarta.servlet.DispatcherType;
import java.util.List;
import next.galym_community.model.enums.RoleGalym;
import next.galym_community.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {})
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(
                        e ->
                                e.authenticationEntryPoint(
                                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .authorizeHttpRequests(
                        auth ->
                                // Error pages are rendered in a second, unauthenticated
                                // dispatch; without this every 400/403/404 turns into a 401.
                                auth.dispatcherTypeMatchers(DispatcherType.ERROR)
                                        .permitAll()
                                        .requestMatchers("/auth/**")
                                        .permitAll()
                                        .requestMatchers("/galym/**")
                                        .permitAll()
                                        .requestMatchers("/admin/**")
                                        .hasRole(RoleGalym.ADMIN.name())
                                        .anyRequest()
                                        .authenticated())
                .addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${cors.allowed-origins}") List<String> allowedOrigins) {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(allowedOrigins);

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
