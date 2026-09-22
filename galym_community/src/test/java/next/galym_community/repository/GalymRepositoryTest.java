package next.galym_community.repository;

import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class GalymRepositoryTest {

    @Autowired
    private GalymRepository galymRepository;

    @Test
    void filtersOpportunitiesByCountryAndScholarship() {
        // Opportunity 1: Germany, has scholarship
        GalymEntity galym1 = new GalymEntity();
        galym1.setTitle("DAAD Scholarship");
        galym1.setType(GalymType.SCHOLARSHIP);
        galym1.setCountry("Germany");
        galym1.setCity("Berlin");
        galym1.setApplicationDeadline(LocalDate.of(2027, 3, 1));
        galym1.setStatus(GalymStatus.PUBLISHED);
        galym1.setHasScholarship(true);
        galymRepository.save(galym1);

        // Opportunity 2: France, no scholarship
        GalymEntity galym2 = new GalymEntity();
        galym2.setTitle("Paris Internship");
        galym2.setType(GalymType.INTERNSHIP);
        galym2.setCountry("France");
        galym2.setCity("Paris");
        galym2.setApplicationDeadline(LocalDate.of(2027, 3, 1));
        galym2.setStatus(GalymStatus.PUBLISHED);
        galym2.setHasScholarship(false);
        galymRepository.save(galym2);

        // Search: only Germany, ignore everything else
        List<GalymEntity> results = galymRepository.search(
                GalymStatus.PUBLISHED,
                LocalDate.now(),
                null,
                "Germany",
                null,
                null,
                true
        );

        System.out.println("RESULT SIZE = " + results.size());

        for (GalymEntity g : results) {
            System.out.println(
                    "Title: " + g.getTitle() +
                            ", Country: " + g.getCountry() +
                            ", Scholarship: " + g.isHasScholarship()
            );
        }

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("DAAD Scholarship");
    }
}