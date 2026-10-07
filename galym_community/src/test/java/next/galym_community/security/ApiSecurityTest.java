package next.galym_community.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiSecurityTest {

    @Autowired private MockMvc mockMvc;

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
