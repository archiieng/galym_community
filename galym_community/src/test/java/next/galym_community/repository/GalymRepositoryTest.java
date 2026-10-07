package next.galym_community.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import next.galym_community.dto.GalymResponse;
import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import next.galym_community.service.GalymService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class GalymRepositoryTest {
    private static final LocalDate NEXT_YEAR = LocalDate.now().plusYears(1);

    @Autowired private GalymRepository galymRepository;
    @Autowired private GalymService galymService;

    // Every row but the first differs from it in exactly one way, so each filter is
    // the only thing keeping its row out of the result.
    @BeforeEach
    void saveOpportunities() {
        save("Zqx DAAD Scholarship", "Test-Germany", true, GalymStatus.PUBLISHED, NEXT_YEAR);
        save("Zqx Unfunded", "Test-Germany", false, GalymStatus.PUBLISHED, NEXT_YEAR);
        save("Zqx Paris Internship", "Test-France", true, GalymStatus.PUBLISHED, NEXT_YEAR);
        save("Zqx Draft", "Test-Germany", true, GalymStatus.DRAFT, NEXT_YEAR);
        save(
                "Zqx Expired",
                "Test-Germany",
                true,
                GalymStatus.PUBLISHED,
                LocalDate.now().minusDays(1));
    }

    @Test
    void filtersByCountryAndFundingAndHidesDraftsAndExpired() {
        List<GalymResponse> results =
                galymService.searchPublished(null, null, "test-GERMANY", null, null, true);

        assertThat(results)
                .extracting(GalymResponse::title)
                .containsExactly("Zqx DAAD Scholarship");
    }

    @Test
    void keywordMatchesPartOfTheTitle() {
        List<GalymResponse> results =
                galymService.searchPublished(null, "zqx paris", null, null, null, null);

        assertThat(results)
                .extracting(GalymResponse::title)
                .containsExactly("Zqx Paris Internship");
    }

    @Test
    void likeWildcardsInTheKeywordAreTakenLiterally() {
        assertThat(galymService.searchPublished(null, "zqx%intern", null, null, null, null))
                .isEmpty();
        assertThat(galymService.searchPublished(null, "zqx_paris", null, null, null, null))
                .isEmpty();
    }

    private void save(
            String title,
            String country,
            boolean hasScholarship,
            GalymStatus status,
            LocalDate deadline) {
        GalymEntity galym = new GalymEntity();
        galym.setTitle(title);
        galym.setDescription("description");
        galym.setType(GalymType.SCHOLARSHIP);
        galym.setCountry(country);
        galym.setCity("city");
        galym.setOrganizationName("organization");
        galym.setEligibility("eligibility");
        galym.setApplicationInstructions("instructions");
        galym.setApplicationDeadline(deadline);
        galym.setFundingInfo("funding");
        galym.setHasScholarship(hasScholarship);
        galym.setStatus(status);
        galym.setCreatedAt(LocalDateTime.now());
        galym.setUpdatedAt(LocalDateTime.now());
        galymRepository.save(galym);
    }
}
