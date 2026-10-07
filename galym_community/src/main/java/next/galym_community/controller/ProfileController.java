package next.galym_community.controller;

import java.util.List;
import next.galym_community.dto.GalymResponse;
import next.galym_community.dto.UserResponse;
import next.galym_community.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/me")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(profileService.getProfile(user.getUsername()));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<GalymResponse>> getSaved(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(profileService.getSaved(user.getUsername()));
    }

    @PutMapping("/saved/{galymId}")
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal UserDetails user, @PathVariable Long galymId) {
        profileService.save(user.getUsername(), galymId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/saved/{galymId}")
    public ResponseEntity<Void> unsave(
            @AuthenticationPrincipal UserDetails user, @PathVariable Long galymId) {
        profileService.unsave(user.getUsername(), galymId);
        return ResponseEntity.noContent().build();
    }
}
