// === Entity: DonationRegistration.java ===
package com.example.demo1.entity;

import com.example.demo1.entity.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@NoArgsConstructor
@Data
@Table(name = "donation_registrations")
public class DonationRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType;
    private LocalDate lastDonationDate;
    private Double weight;
    private Double height;
    private Integer amount;
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private DonationLocation location;

    private String gender; //

    @ManyToMany
    @JoinTable(
            name = "registration_diseases",
            joinColumns = @JoinColumn(name = "registration_id"),
            inverseJoinColumns = @JoinColumn(name = "disease_id")
    )
    private Set<ProhibitedDisease> diseases;


}