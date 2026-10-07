package next.galym_community.controller;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import next.galym_community.dto.UserResponse;
import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.entity.UserEntity;
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

/** Editing your own account, and admins managing other people's. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AccountManagementTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserService userService;
    @Autowired private AuthService authService;
    @Autowired private UserRepository userRepository;

    @Test
    void userRenamesThemselvesAndChangesPassword() throws Exception {
        String bearer = registerAndLogin("Old Name", "editor@test.com", "password123");

        mockMvc.perform(
                        patch("/users/me")
                                .header("Authorization", bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"name\":\"New Name\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Name"));

        mockMvc.perform(passwordChange(bearer, "wrong-password", "newpassword456"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(passwordChange(bearer, "password123", "short"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(passwordChange(bearer, "password123", "newpassword456"))
                .andExpect(status().isNoContent());

        assertDoesNotThrow(
                () -> authService.login(new LoginRequest("editor@test.com", "newpassword456")));
    }

    @Test
    void adminPromotesAnotherUserButCannotTouchTheirOwnAccount() throws Exception {
        String adminBearer = registerAndLogin("Boss", "boss@test.com", "password123");
        UserEntity admin = userRepository.findByEmail("boss@test.com").orElseThrow();
        admin.setRole(RoleGalym.ADMIN);
        UserResponse other =
                userService.register(new RegisterRequest("Other", "other@test.com", "password123"));

        mockMvc.perform(roleChange(adminBearer, other.id(), "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));

        mockMvc.perform(roleChange(adminBearer, admin.getId(), "USER"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(delete("/admin/user/" + admin.getId()).header("Authorization", adminBearer))
                .andExpect(status().isBadRequest());
    }

    @Test
    void regularUserCannotChangeRoles() throws Exception {
        String bearer = registerAndLogin("Plain", "plain@test.com", "password123");
        Long ownId = userRepository.findByEmail("plain@test.com").orElseThrow().getId();

        mockMvc.perform(roleChange(bearer, ownId, "ADMIN")).andExpect(status().isForbidden());
    }

    private String registerAndLogin(String name, String email, String password) {
        userService.register(new RegisterRequest(name, email, password));
        return "Bearer " + authService.login(new LoginRequest(email, password));
    }

    private static org.springframework.test.web.servlet.RequestBuilder passwordChange(
            String bearer, String current, String next) {
        return put("/users/me/password")
                .header("Authorization", bearer)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"currentPassword\":\""
                                + current
                                + "\",\"newPassword\":\""
                                + next
                                + "\"}");
    }

    private static org.springframework.test.web.servlet.RequestBuilder roleChange(
            String bearer, Long userId, String role) {
        return patch("/admin/user/" + userId + "/role")
                .header("Authorization", bearer)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"role\":\"" + role + "\"}");
    }
}
