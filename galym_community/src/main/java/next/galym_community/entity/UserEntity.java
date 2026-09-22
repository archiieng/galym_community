package next.galym_community.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import next.galym_community.model.enums.RoleGalym;


@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @NotBlank
    @Column(name = "name")
    private String name;
    @NotBlank
    @Email
    @Column(name = "email")
    private String email;
    @NotBlank
    @Column(name = "password_hash")
    private String passwordHash;
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private RoleGalym role;

    public UserEntity() {}
    public UserEntity(Long id, String name, String email, String passwordHash, RoleGalym role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public RoleGalym getRole() {
        return role;
    }

    public void setRole(RoleGalym role) {
        this.role = role;
    }
}
