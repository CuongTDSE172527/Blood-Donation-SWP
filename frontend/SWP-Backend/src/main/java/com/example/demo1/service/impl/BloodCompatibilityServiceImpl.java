package com.example.demo1.service.impl;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.service.BloodCompatibilityService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BloodCompatibilityServiceImpl implements BloodCompatibilityService {

    // Blood type compatibility matrix
    // Key: Recipient blood type, Value: List of compatible donor blood types
    private static final Map<String, List<String>> COMPATIBILITY_MATRIX = new HashMap<>();
    
    static {
        // O- can receive from O- only
        COMPATIBILITY_MATRIX.put("O-", Arrays.asList("O-"));
        
        // O+ can receive from O- and O+
        COMPATIBILITY_MATRIX.put("O+", Arrays.asList("O-", "O+"));
        
        // A- can receive from O- and A-
        COMPATIBILITY_MATRIX.put("A-", Arrays.asList("O-", "A-"));
        
        // A+ can receive from O-, O+, A-, A+
        COMPATIBILITY_MATRIX.put("A+", Arrays.asList("O-", "O+", "A-", "A+"));
        
        // B- can receive from O- and B-
        COMPATIBILITY_MATRIX.put("B-", Arrays.asList("O-", "B-"));
        
        // B+ can receive from O-, O+, B-, B+
        COMPATIBILITY_MATRIX.put("B+", Arrays.asList("O-", "O+", "B-", "B+"));
        
        // AB- can receive from O-, A-, B-, AB-
        COMPATIBILITY_MATRIX.put("AB-", Arrays.asList("O-", "A-", "B-", "AB-"));
        
        // AB+ can receive from all blood types (universal recipient)
        COMPATIBILITY_MATRIX.put("AB+", Arrays.asList("O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"));
    }

    @Override
    public List<String> getCompatibleBloodTypes(String bloodType) {
        return COMPATIBILITY_MATRIX.getOrDefault(bloodType, new ArrayList<>());
    }

    @Override
    public Map<String, Integer> findAvailableCompatibleBlood(String requestedBloodType, List<BloodInventory> inventory) {
        List<String> compatibleTypes = getCompatibleBloodTypes(requestedBloodType);
        Map<String, Integer> availableCompatible = new HashMap<>();
        
        // Filter inventory for compatible blood types with available quantity
        for (BloodInventory item : inventory) {
            if (compatibleTypes.contains(item.getBloodType()) && 
                item.getQuantity() != null && 
                item.getQuantity() > 0) {
                availableCompatible.put(item.getBloodType(), item.getQuantity());
            }
        }
        
        // Sort by priority (O- first, then O+, then others)
        return availableCompatible.entrySet().stream()
                .sorted((e1, e2) -> {
                    int priority1 = getBloodTypePriority(e1.getKey());
                    int priority2 = getBloodTypePriority(e2.getKey());
                    return Integer.compare(priority1, priority2);
                })
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (e1, e2) -> e1,
                    LinkedHashMap::new
                ));
    }

    @Override
    public boolean isCompatible(String recipientBloodType, String donorBloodType) {
        List<String> compatibleTypes = getCompatibleBloodTypes(recipientBloodType);
        return compatibleTypes.contains(donorBloodType);
    }
    
    /**
     * Get priority for blood type (lower number = higher priority)
     * Priority order: O- (1), O+ (2), A- (3), B- (4), A+ (5), B+ (6), AB- (7), AB+ (8)
     */
    private int getBloodTypePriority(String bloodType) {
        switch (bloodType) {
            case "O-": return 1;
            case "O+": return 2;
            case "A-": return 3;
            case "B-": return 4;
            case "A+": return 5;
            case "B+": return 6;
            case "AB-": return 7;
            case "AB+": return 8;
            default: return 9;
        }
    }
} 