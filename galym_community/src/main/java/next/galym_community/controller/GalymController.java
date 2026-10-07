package next.galym_community.controller;

import java.util.List;
import next.galym_community.dto.GalymResponse;
import next.galym_community.model.enums.GalymType;
import next.galym_community.service.GalymService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/galym")
public class GalymController {
    private final GalymService galymService;

    public GalymController(GalymService galymService) {
        this.galymService = galymService;
    }

    @GetMapping
    public ResponseEntity<List<GalymResponse>> search(
            @RequestParam(required = false) GalymType type,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String organizationName,
            @RequestParam(required = false) Boolean hasScholarship) {
        return ResponseEntity.ok(
                galymService.searchPublished(
                        type, country, city, organizationName, hasScholarship));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GalymResponse> getPublished(@PathVariable Long id) {
        return ResponseEntity.ok(galymService.getPublishedById(id));
    }
}
