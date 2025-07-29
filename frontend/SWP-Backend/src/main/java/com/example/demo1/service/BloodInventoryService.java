package com.example.demo1.service;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.dto.BloodCompatibilityResponse;

import java.util.List;
import java.util.Optional;

public interface BloodInventoryService {
    List<BloodInventory> getAll();
    Optional<BloodInventory> findByBloodType(String bloodType);
    BloodInventory save(BloodInventory inventory);
    BloodCompatibilityResponse checkBloodAvailabilityWithCompatibility(String bloodType, int requestedAmount);
}
