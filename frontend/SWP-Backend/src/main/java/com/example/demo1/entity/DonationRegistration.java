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
    private Double bmi; // Calculated BMI for tracking
    private Integer amount;
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.PENDING;
    
    // Health Screening Data
    private Integer systolicBP;
    private Integer diastolicBP;
    private Integer heartRate;
    private Double temperature;
    private Double hemoglobin;
    
    // Medication & Surgery History
    @Column(columnDefinition = "TEXT")
    private String currentMedications;
    private Boolean recentSurgery = false;
    @Column(columnDefinition = "TEXT")
    private String surgeryDetails;
    private LocalDate surgeryDate;
    
    // Lifestyle & Risk Factors
    private Boolean recentTravel = false;
    @Column(columnDefinition = "TEXT")
    private String travelDetails;
    private Boolean recentTattoo = false;
    private LocalDate tattooDate;
    private Boolean recentPiercing = false;
    private LocalDate piercingDate;
    private Boolean recentVaccination = false;
    @Column(columnDefinition = "TEXT")
    private String vaccinationDetails;
    
    // Women's Health (for females)
    private Boolean isPregnant = false;
    private Boolean isBreastfeeding = false;
    private String menstrualCycle;
    
    // Consent & Declarations
    private Boolean healthDeclaration = false;
    private Boolean consentForm = false;
    private Boolean dataProcessingConsent = false;
    
    // Screening Results
    private Boolean eligibilityStatus;
    @Column(columnDefinition = "TEXT")
    private String eligibilityNotes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private DonationLocation location;

    //private String gender;

    @ManyToMany
    @JoinTable(
            name = "registration_diseases",
            joinColumns = @JoinColumn(name = "registration_id"),
            inverseJoinColumns = @JoinColumn(name = "disease_id")
    )
    private Set<ProhibitedDisease> diseases;


}