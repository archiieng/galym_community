package next.galym_community.service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import next.galym_community.dto.GalymRequest;
import next.galym_community.dto.GalymResponse;
import next.galym_community.entity.GalymEntity;
import next.galym_community.entity.UserEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import next.galym_community.repository.GalymRepository;
import next.galym_community.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class GalymService {
    private final GalymRepository galymRepository;
    private final UserRepository userRepository;

    public GalymService(GalymRepository galymRepository, UserRepository userRepository) {
        this.galymRepository = galymRepository;
        this.userRepository = userRepository;
    }

    public List<GalymResponse> searchPublished(
            GalymType type,
            String country,
            String city,
            String organizationName,
            Boolean hasScholarship) {
        List<GalymEntity> results =
                galymRepository.search(
                        GalymStatus.PUBLISHED,
                        LocalDate.now(),
                        type,
                        country,
                        city,
                        organizationName,
                        hasScholarship);
        return results.stream().map(GalymResponse::from).toList();
    }

    public GalymResponse getPublishedById(Long id) {
        var galym =
                galymRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Galym not found with this id=" + id));
        if (!GalymStatus.PUBLISHED.equals(galym.getStatus())) {
            throw new EntityNotFoundException("Galym is not published with id=" + id);
        }
        return GalymResponse.from(galym);
    }

    public List<GalymResponse> findAllForAdmin(GalymStatus status) {
        List<GalymEntity> results =
                (status == null)
                        ? galymRepository.findAllByOrderByIdDesc()
                        : galymRepository.findByStatusOrderByIdDesc(status);
        return results.stream().map(GalymResponse::from).toList();
    }

    public GalymResponse getByIdForAdmin(long id) {
        var galym =
                galymRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Galym not found with this id=" + id));
        return GalymResponse.from(galym);
    }

    public GalymResponse create(GalymRequest request, String creatorEmail) {
        var now = LocalDateTime.now();
        var galym = new GalymEntity();
        apply(request, galym);
        galym.setStatus(GalymStatus.DRAFT);
        galym.setCreatedByUserId(
                userRepository.findByEmail(creatorEmail).map(UserEntity::getId).orElse(null));
        galym.setCreatedAt(now);
        galym.setUpdatedAt(now);
        return GalymResponse.from(galymRepository.save(galym));
    }

    public GalymResponse update(long id, GalymRequest request) {
        var galym =
                galymRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Galym not found with this id=" + id));
        // status, creator and creation time stay as they are on the existing record
        apply(request, galym);
        galym.setUpdatedAt(LocalDateTime.now());
        return GalymResponse.from(galymRepository.save(galym));
    }

    private static void apply(GalymRequest request, GalymEntity galym) {
        galym.setTitle(request.title());
        galym.setDescription(request.description());
        galym.setType(request.type());
        galym.setCountry(request.country());
        galym.setCity(request.city());
        galym.setOrganizationName(request.organizationName());
        galym.setEligibility(request.eligibility());
        galym.setApplicationInstructions(request.applicationInstructions());
        galym.setApplicationDeadline(request.applicationDeadline());
        galym.setFundingInfo(request.fundingInfo());
        galym.setHasScholarship(request.hasScholarship());
        galym.setApplicationLink(request.applicationLink());
    }

    public GalymResponse publish(Long id) {
        var galym =
                galymRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Galym not found with this id=" + id));
        galym.setStatus(GalymStatus.PUBLISHED);
        galym.setUpdatedAt(LocalDateTime.now());
        return GalymResponse.from(galymRepository.save(galym));
    }

    public GalymResponse unpublish(Long id) {
        var galym =
                galymRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Galym not found with this id=" + id));
        galym.setStatus(GalymStatus.DRAFT);
        galym.setUpdatedAt(LocalDateTime.now());
        return GalymResponse.from(galymRepository.save(galym));
    }

    public void delete(Long id) {
        var galym =
                galymRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Galym not found with this id=" + id));
        galymRepository.delete(galym);
    }
}
