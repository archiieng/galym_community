package next.galym_community.repository;

import java.time.LocalDate;
import java.util.List;
import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GalymRepository extends JpaRepository<GalymEntity, Long> {
    /**
     * The text parameters are lower-cased LIKE patterns ("%berlin%") or null for "any"; {@code q}
     * is matched against every text field a visitor would search by.
     */
    @Query(
            """
        SELECT g FROM GalymEntity g
        WHERE g.status = :status
        AND g.applicationDeadline >= :today
        AND (:type IS NULL OR g.type = :type)
        AND (:q IS NULL
            OR LOWER(g.title) LIKE :q ESCAPE '\\'
            OR LOWER(g.organizationName) LIKE :q ESCAPE '\\'
            OR LOWER(g.description) LIKE :q ESCAPE '\\'
            OR LOWER(g.country) LIKE :q ESCAPE '\\'
            OR LOWER(g.city) LIKE :q ESCAPE '\\')
        AND (:country IS NULL OR LOWER(g.country) LIKE :country ESCAPE '\\')
        AND (:city IS NULL OR LOWER(g.city) LIKE :city ESCAPE '\\')
        AND (:organizationName IS NULL
            OR LOWER(g.organizationName) LIKE :organizationName ESCAPE '\\')
        AND (:hasScholarship IS NULL OR g.hasScholarship = :hasScholarship)
        ORDER BY g.applicationDeadline, g.id
        """)
    List<GalymEntity> search(
            @Param("status") GalymStatus status,
            @Param("today") LocalDate today,
            @Param("type") GalymType type,
            @Param("q") String q,
            @Param("country") String country,
            @Param("city") String city,
            @Param("organizationName") String organizationName,
            @Param("hasScholarship") Boolean hasScholarship);

    List<GalymEntity> findAllByOrderByIdDesc();

    List<GalymEntity> findByStatusOrderByIdDesc(GalymStatus status);
}
