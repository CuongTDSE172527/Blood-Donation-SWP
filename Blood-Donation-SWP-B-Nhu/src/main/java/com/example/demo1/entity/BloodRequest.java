package com.example.demo1.entity;

import com.example.demo1.entity.enums.BloodRequestStatus;
import com.example.demo1.entity.enums.BloodUrgencyLevel;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientName;

    private String recipientBloodType;

    private int requestedAmount;

    private LocalDate requestDate;

    @Enumerated(EnumType.STRING)
    private BloodUrgencyLevel urgencyLevel;

    @Enumerated(EnumType.STRING)
    private BloodRequestStatus status = BloodRequestStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "medical_center_id")
    private User medicalCenter;
}
