package next.galym_community.controller;

import jakarta.validation.Valid;
import java.util.List;
import next.galym_community.dto.RoleUpdateRequest;
import next.galym_community.dto.UserResponse;
import next.galym_community.dto.UserUpdateRequest;
import next.galym_community.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/user")
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        log.info("Called getUser: id={}", id);
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.info("Called getAllUsers");
        return ResponseEntity.ok(userService.findAllUser());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserUpdateRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        log.info("Called updateUser: id={}", id);
        UserResponse updated = userService.updateUser(id, request, admin.getUsername());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> changeRole(
            @PathVariable Long id,
            @RequestBody @Valid RoleUpdateRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        log.info("Called changeRole: id={}, role={}", id, request.role());
        return ResponseEntity.ok(userService.changeRole(id, request.role(), admin.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponse> deleteUser(
            @PathVariable Long id, @AuthenticationPrincipal UserDetails admin) {
        log.info("Called deleteUser: id={}", id);
        userService.deleteUser(id, admin.getUsername());
        return ResponseEntity.ok().build();
    }
}
