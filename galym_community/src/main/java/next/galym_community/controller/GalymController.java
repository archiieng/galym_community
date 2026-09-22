package next.galym_community.controller;


import next.galym_community.dto.GalymResponse;
import next.galym_community.model.enums.GalymType;
import next.galym_community.repository.GalymRepository;
import next.galym_community.service.GalymService;
import next.galym_community.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/galym")
public class GalymController {
    Logger logger = LoggerFactory.getLogger(GalymController.class);
    private final GalymService galymService;
    public GalymController(GalymService galymService) {
        this.galymService = galymService;
    }

    @GetMapping
    public ResponseEntity<List<GalymResponse>> search(
            @RequestParam(required = false)GalymType type,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String organizationName,
            @RequestParam(required = false) Boolean hasScholarship
            ){
        return ResponseEntity.ok(galymService.searchPublished(type, country, city, organizationName, hasScholarship));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GalymResponse> getPublished(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(galymService.getPublishedById(id));
    }
}
