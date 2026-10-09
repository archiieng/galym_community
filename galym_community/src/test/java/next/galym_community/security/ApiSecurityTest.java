package next.galym_community.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.UUID;
import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.model.enums.RoleGalym;
import next.galym_community.repository.UserRepository;
import next.galym_community.service.AuthService;
import next.galym_community.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ApiSecurityTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserService userService;
    @Autowired private AuthService authService;
    @Autowired private UserRepository userRepository;

    @Test
    void profileAndAuthMeRequireAuthentication() throws Exception {
        for (String path : new String[] {"/users/me", "/users/me/saved", "/auth/me"}) {
            mockMvc.perform(get(path))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value(401))
                    .andExpect(jsonPath("$.message").value("Authentication is required"));
        }
    }

    @Test
    void userCannotListOrCreateAdminOpportunities() throws Exception {
        String bearer = loginAs(RoleGalym.USER);
        mockMvc.perform(get("/admin/galym").header("Authorization", bearer))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(
                        jsonPath("$.message")
                                .value("You do not have permission to access this resource"));
        mockMvc.perform(
                        post("/admin/galym")
                                .header("Authorization", bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(opportunityBody()))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanListAndCreateOpportunities() throws Exception {
        String bearer = loginAs(RoleGalym.ADMIN);
        mockMvc.perform(get("/admin/galym").header("Authorization", bearer))
                .andExpect(status().isOk());
        mockMvc.perform(
                        post("/admin/galym")
                                .header("Authorization", bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(opportunityBody()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Security test scholarship"))
                .andExpect(jsonPath("$.status").value("DRAFT"));
    }

    @Test
    void userAndAdminCanLoadProfiles() throws Exception {
        for (RoleGalym role : RoleGalym.values()) {
            String bearer = loginAs(role);
            for (String path : new String[] {"/users/me", "/auth/me"}) {
                mockMvc.perform(get(path).header("Authorization", bearer))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.role").value(role.name()));
            }
            mockMvc.perform(get("/users/me/saved").header("Authorization", bearer))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }

    private String loginAs(RoleGalym role) {
        String email = "security-" + UUID.randomUUID() + "@test.com";
        userService.register(new RegisterRequest("Security test", email, "password123"));
        var user = userRepository.findByEmail(email).orElseThrow();
        user.setRole(role);
        userRepository.saveAndFlush(user);
        return "Bearer " + authService.login(new LoginRequest(email, "password123"));
    }

    private String opportunityBody() {
        return """
                {"title":"Security test scholarship","description":"Description",
                 "type":"SCHOLARSHIP","country":"Kazakhstan","city":"Almaty",
                 "organizationName":"University","eligibility":"Students",
                 "applicationInstructions":"Apply online","applicationDeadline":"%s",
                 "fundingInfo":"Full funding","hasScholarship":true}
                """
                .formatted(LocalDate.now().plusDays(30));
    }

    @Test
    void publicListIsOpen() throws Exception {
        mockMvc.perform(get("/galym")).andExpect(status().isOk());
    }

    @Test
    void adminRoutesRejectMissingAndForgedTokens() throws Exception {
        mockMvc.perform(get("/admin/galym")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/admin/galym").header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidRegistrationIsABadRequest() throws Exception {
        mockMvc.perform(
                        post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"name\":\"\",\"email\":\"nope\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest());
    }
}
