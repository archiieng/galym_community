package next.galym_community.controller;


import jakarta.validation.Valid;
import next.galym_community.dto.UserResponse;
import next.galym_community.entity.UserEntity;
import next.galym_community.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/user")
public class UserController {
    Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        log.info("Called getUser: id={}", id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.info("Called getAllUsers");
        return ResponseEntity.ok(userService.findAllUser());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserEntity UserToUpdate
    ) {
        log.info("Called updateUser: id={}", id);
        UserResponse updated = userService.updateUser(id, UserToUpdate);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable Long id) {
        log.info("Called deleteUser: id={}", id);
        userService.dropppedUser(id);
        return ResponseEntity.ok().build();
    }

}
