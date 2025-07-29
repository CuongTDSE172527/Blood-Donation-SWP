package com.example.demo1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodCompatibilityResponse {
    private String requestedBloodType;
    private boolean isAvailable;
    private Integer availableQuantity;
    private List<String> allCompatibleTypes;
    private Map<String, Integer> availableCompatibleTypes;
    private String message;
    
    public BloodCompatibilityResponse(String requestedBloodType, boolean isAvailable, Integer availableQuantity) {
        this.requestedBloodType = requestedBloodType;
        this.isAvailable = isAvailable;
        this.availableQuantity = availableQuantity;
    }
    
    public BloodCompatibilityResponse(String requestedBloodType, boolean isAvailable, Integer availableQuantity, 
                                    List<String> allCompatibleTypes, Map<String, Integer> availableCompatibleTypes) {
        this.requestedBloodType = requestedBloodType;
        this.isAvailable = isAvailable;
        this.availableQuantity = availableQuantity;
        this.allCompatibleTypes = allCompatibleTypes;
        this.availableCompatibleTypes = availableCompatibleTypes;
        
        // Generate message
        if (isAvailable) {
            this.message = "Nhóm máu " + requestedBloodType + " có sẵn trong kho với số lượng: " + availableQuantity;
        } else {
            if (availableCompatibleTypes.isEmpty()) {
                this.message = "Nhóm máu " + requestedBloodType + " không có sẵn và không có nhóm máu tương thích nào trong kho";
            } else {
                this.message = "Nhóm máu " + requestedBloodType + " không đủ trong kho. Các nhóm máu tương thích có sẵn: " + 
                             String.join(", ", availableCompatibleTypes.keySet());
            }
        }
    }
} 