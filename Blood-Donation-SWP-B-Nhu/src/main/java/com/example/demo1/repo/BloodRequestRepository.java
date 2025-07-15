package com.example.demo1.repo;

import com.example.demo1.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByMedicalCenterId(Long medicalCenterId);
}
