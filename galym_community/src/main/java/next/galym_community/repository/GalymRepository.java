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
    @Query(
            """
        SELECT g FROM GalymEntity g
        WHERE g.status = :status
        AND g.applicationDeadline >= :today
        AND (:type IS NULL OR g.type = :type)
        AND (:country IS NULL OR g.country = :country)
        AND (:city IS NULL OR g.city = :city)
        AND (:organizationName IS NULL OR g.organizationName = :organizationName)
        AND (:hasScholarship IS NULL OR g.hasScholarship = :hasScholarship)
        ORDER BY g.applicationDeadline, g.id
        """)
    List<GalymEntity> search(
            @Param("status") GalymStatus status,
            @Param("today") LocalDate today,
            @Param("type") GalymType type,
            @Param("country") String country,
            @Param("city") String city,
            @Param("organizationName") String organizationName,
            @Param("hasScholarship") Boolean hasScholarship);

    List<GalymEntity> findAllByOrderByIdDesc();

    List<GalymEntity> findByStatusOrderByIdDesc(GalymStatus status);
}
