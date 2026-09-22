package next.galym_community.service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import next.galym_community.dto.GalymResponse;
import next.galym_community.entity.GalymEntity;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.model.enums.GalymType;
import next.galym_community.repository.GalymRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GalymService {
    private final GalymRepository galymRepository;
    public GalymService(
            GalymRepository galymRepository
    ) {
        this.galymRepository = galymRepository;
    }

    public List<GalymResponse> searchPublished(GalymType type, String country, String city, String organizationName, Boolean hasScholarship) {
        List<GalymEntity> results = galymRepository.search(GalymStatus.PUBLISHED,
                LocalDate.now(),
                type, country, city, organizationName, hasScholarship);
        return results.stream()
                .map(GalymResponse :: from).toList();
    }

    public GalymResponse getPublishedById(Long id) {
        var galym = galymRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Galym not found with this id=" + id));
        if(!GalymStatus.PUBLISHED.equals(galym.getStatus())){
            throw new EntityNotFoundException("Galym is not published with id=" + id);
        }
        return GalymResponse.from(galym);
    }

    public List<GalymResponse> findAllForAdmin(GalymStatus status) {
        List<GalymEntity> results = (status == null) ? galymRepository.findAll():galymRepository.findByStatus(status);
        return results.stream()
                .map(GalymResponse :: from).toList();
    }

    public GalymResponse getByIdForAdmin(long id) {
        var galym = galymRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Galym not found with this id=" + id));
        return GalymResponse.from(galym);
    }

    public GalymResponse create(@Valid GalymEntity galymToCreate) {
        if(galymToCreate.getTitle() == null || galymToCreate.getTitle().isEmpty()){
            throw new ValidationException("Title is required");
        }
        if(galymToCreate.getType() == null){
            throw new ValidationException("Type is required");
        }
        if(galymToCreate.getApplicationDeadline() == null){
            throw new ValidationException("Application deadline is required");
        }
        var now = LocalDateTime.now();
        var entityToSave = new GalymEntity(
                null,
                galymToCreate.getTitle(),
                galymToCreate.getDescription(),
                galymToCreate.getType(),
                galymToCreate.getCountry(),
                galymToCreate.getCity(),
                galymToCreate.getOrganizationName(),
                galymToCreate.getEligibility(),
                galymToCreate.getApplicationInstructions(),
                galymToCreate.getApplicationDeadline(),
                galymToCreate.getFundingInfo(),
                galymToCreate.isHasScholarship(),
                galymToCreate.getApplicationLink(),
                GalymStatus.DRAFT,
                galymToCreate.getCreatedByUserId(),
                now,
                now
        );
        return GalymResponse.from(galymRepository.save(entityToSave));
    }

    public GalymResponse update(long id, GalymEntity galymToUpdate) {
        var GalymUpdate = galymRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Galym not found with this id=" + id));
        if(galymToUpdate.getTitle() == null || galymToUpdate.getTitle().isEmpty()){
            throw new ValidationException("Title is required");
        }
        var entityToSave = new GalymEntity(
                GalymUpdate.getId(),
                galymToUpdate.getTitle(),
                galymToUpdate.getDescription(),
                galymToUpdate.getType(),
                galymToUpdate.getCountry(),
                galymToUpdate.getCity(),
                galymToUpdate.getOrganizationName(),
                galymToUpdate.getEligibility(),
                galymToUpdate.getApplicationInstructions(),
                galymToUpdate.getApplicationDeadline(),
                galymToUpdate.getFundingInfo(),
                galymToUpdate.isHasScholarship(),
                galymToUpdate.getApplicationLink(),
                GalymUpdate.getStatus(), // kept from the existing record, never from the request
                GalymUpdate.getCreatedByUserId(), // who created it never changes
                GalymUpdate.getCreatedAt(), // creation time never changes
                LocalDateTime.now() // only updatedAt refreshes
        );
        GalymEntity savedGalym = galymRepository.save(entityToSave);
        return GalymResponse.from(savedGalym);
    }

    public GalymResponse publish(Long id) {
        var galym =  galymRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Galym not found with this id=" + id));
        galym.setStatus(GalymStatus.PUBLISHED);
        galym.setUpdatedAt(LocalDateTime.now());
        return GalymResponse.from(galymRepository.save(galym));
    }

    public GalymResponse unpublish(Long id) {
        var galym =  galymRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Galym not found with this id=" + id));
        galym.setStatus(GalymStatus.DRAFT);
        galym.setUpdatedAt(LocalDateTime.now());
        return GalymResponse.from(galymRepository.save(galym));
    }

    public void delete(Long id) {
        var galym =   galymRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Galym not found with this id=" + id));
        galymRepository.delete(galym);
    }
}
