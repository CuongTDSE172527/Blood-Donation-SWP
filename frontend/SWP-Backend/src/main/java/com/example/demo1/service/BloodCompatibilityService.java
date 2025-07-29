package com.example.demo1.service;

import com.example.demo1.entity.BloodInventory;
import java.util.List;
import java.util.Map;

public interface BloodCompatibilityService {
    
    /**
     * Get compatible blood types for a given blood type
     * @param bloodType The blood type to find compatibles for
     * @return List of compatible blood types
     */
    List<String> getCompatibleBloodTypes(String bloodType);
    
    /**
     * Find available compatible blood types in inventory
     * @param requestedBloodType The blood type requested
     * @param inventory Current blood inventory
     * @return Map of compatible blood types with their available quantities
     */
    Map<String, Integer> findAvailableCompatibleBlood(String requestedBloodType, List<BloodInventory> inventory);
    
    /**
     * Check if a blood type is compatible with another
     * @param recipientBloodType The recipient's blood type
     * @param donorBloodType The donor's blood type
     * @return true if compatible, false otherwise
     */
    boolean isCompatible(String recipientBloodType, String donorBloodType);
} 