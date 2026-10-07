package next.galym_community.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import next.galym_community.repository.GalymRepository;
import next.galym_community.repository.UserRepository;
import next.galym_community.service.AuthService;
import next.galym_community.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Deliberately not @Transactional: a test-wide transaction would keep one session open and hide
 * lazy-loading failures that the real application (open-in-view is off) would hit.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ProfileControllerTest {
    private static final String EMAIL = "saver@test.com";

    @Autowired private MockMvc mockMvc;
    @Autowired private UserService userService;
    @Autowired private AuthService authService;
    @Autowired private UserRepository userRepository;
    @Autowired private GalymRepository galymRepository;

    private Long galymId;

    @AfterEach
    void removeWhatTheTestCreated() {
        // saved_galym rows go with either side (ON DELETE CASCADE).
        userRepository.findByEmail(EMAIL).ifPresent(userRepository::delete);
        if (galymId != null) {
            galymRepository.deleteById(galymId);
        }
    }

    @Test
    void userSavesAndRemovesAnOpportunity() throws Exception {
        userService.register(new RegisterRequest("Saver", EMAIL, "password123"));
        String bearer = "Bearer " + authService.login(new LoginRequest(EMAIL, "password123"));
        galymId = galymRepository.save(publishedGalym()).getId();

        mockMvc.perform(get("/users/me").header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));

        mockMvc.perform(put("/users/me/saved/" + galymId).header("Authorization", bearer))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/users/me/saved").header("Authorization", bearer))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Saved one"));

        mockMvc.perform(delete("/users/me/saved/" + galymId).header("Authorization", bearer))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/users/me/saved").header("Authorization", bearer))
                .andExpect(jsonPath("$.length()").value(0));
    }

    private static GalymEntity publishedGalym() {
        GalymEntity galym = new GalymEntity();
        galym.setTitle("Saved one");
        galym.setDescription("description");
        galym.setType(GalymType.SCHOLARSHIP);
        galym.setCountry("country");
        galym.setCity("city");
        galym.setOrganizationName("organization");
        galym.setEligibility("eligibility");
        galym.setApplicationInstructions("instructions");
        galym.setApplicationDeadline(LocalDate.now().plusYears(1));
        galym.setFundingInfo("funding");
        galym.setStatus(GalymStatus.PUBLISHED);
        galym.setCreatedAt(LocalDateTime.now());
        galym.setUpdatedAt(LocalDateTime.now());
        return galym;
    }
}
