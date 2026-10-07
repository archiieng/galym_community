package next.galym_community.controller;

import jakarta.validation.Valid;
import java.util.List;
import next.galym_community.dto.GalymResponse;
import next.galym_community.dto.PasswordChangeRequest;
import next.galym_community.dto.ProfileUpdateRequest;
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

    @PatchMapping
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody @Valid ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateName(user.getUsername(), request.name()));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody @Valid PasswordChangeRequest request) {
        profileService.changePassword(
                user.getUsername(), request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
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
