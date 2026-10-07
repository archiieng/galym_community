package next.galym_community.controller;

import jakarta.validation.Valid;
import java.util.List;
import next.galym_community.dto.GalymRequest;
import next.galym_community.dto.GalymResponse;
import next.galym_community.model.enums.GalymStatus;
import next.galym_community.service.GalymService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/galym")
public class AdminGalymController {
    private final GalymService galymService;

    public AdminGalymController(GalymService galymService) {
        this.galymService = galymService;
    }

    @GetMapping
    public ResponseEntity<List<GalymResponse>> getAll(
            @RequestParam(required = false) GalymStatus status) {
        return ResponseEntity.ok(galymService.findAllForAdmin(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GalymResponse> getById(@PathVariable long id) {
        return ResponseEntity.status(HttpStatus.OK).body(galymService.getByIdForAdmin(id));
    }

    @PostMapping
    public ResponseEntity<GalymResponse> create(
            @RequestBody @Valid GalymRequest request, @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(galymService.create(request, user.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GalymResponse> update(
            @PathVariable long id, @RequestBody @Valid GalymRequest request) {
        return ResponseEntity.ok(galymService.update(id, request));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<GalymResponse> publish(@PathVariable Long id) {
        return ResponseEntity.ok(galymService.publish(id));
    }

    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<GalymResponse> unpublish(@PathVariable Long id) {
        return ResponseEntity.ok(galymService.unpublish(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GalymResponse> delete(@PathVariable Long id) {
        galymService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
