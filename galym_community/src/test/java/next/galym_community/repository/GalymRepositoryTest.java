package next.galym_community.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class GalymRepositoryTest {

    @Autowired private GalymRepository galymRepository;

    @Test
    void filtersOpportunitiesByCountryAndScholarship() {
        galymRepository.save(published("DAAD Scholarship", "Test-Germany", true));
        galymRepository.save(published("Paris Internship", "Test-France", false));

        List<GalymEntity> results =
                galymRepository.search(
                        GalymStatus.PUBLISHED,
                        LocalDate.now(),
                        null,
                        "Test-Germany",
                        null,
                        null,
                        true);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("DAAD Scholarship");
    }

    private static GalymEntity published(String title, String country, boolean hasScholarship) {
        GalymEntity galym = new GalymEntity();
        galym.setTitle(title);
        galym.setDescription("description");
        galym.setType(GalymType.SCHOLARSHIP);
        galym.setCountry(country);
        galym.setCity("city");
        galym.setOrganizationName("organization");
        galym.setEligibility("eligibility");
        galym.setApplicationInstructions("instructions");
        galym.setApplicationDeadline(LocalDate.now().plusYears(1));
        galym.setFundingInfo("funding");
        galym.setHasScholarship(hasScholarship);
        galym.setStatus(GalymStatus.PUBLISHED);
        return galym;
    }
}
