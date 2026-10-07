package next.galym_community.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import next.galym_community.dto.login_and_register.LoginRequest;
import next.galym_community.dto.login_and_register.RegisterRequest;
import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import next.galym_community.repository.GalymRepository;
import next.galym_community.service.AuthService;
import next.galym_community.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProfileControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserService userService;
    @Autowired private AuthService authService;
    @Autowired private GalymRepository galymRepository;

    @Test
    void userSavesAndRemovesAnOpportunity() throws Exception {
        userService.register(new RegisterRequest("Saver", "saver@test.com", "password123"));
        String bearer =
                "Bearer " + authService.login(new LoginRequest("saver@test.com", "password123"));
        Long galymId = galymRepository.save(publishedGalym()).getId();

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
        return galym;
    }
}
