package com.example.demo1.service.impl;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.repo.BloodInventoryRepository;
import com.example.demo1.service.BloodInventoryService;
import com.example.demo1.service.BloodCompatibilityService;
import com.example.demo1.dto.BloodCompatibilityResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BloodInventoryServiceImpl implements BloodInventoryService {

    @Autowired
    private BloodInventoryRepository bloodInventoryRepository;
    
    @Autowired
    private BloodCompatibilityService bloodCompatibilityService;

    @Override
    public List<BloodInventory> getAll() {
        return bloodInventoryRepository.findAll();
    }

    @Override
    public Optional<BloodInventory> findByBloodType(String bloodType) {
        List<BloodInventory> inventories = bloodInventoryRepository.findAllByBloodType(bloodType);
        
        if (inventories.isEmpty()) {
            return Optional.empty();
        }
        
        if (inventories.size() == 1) {
            return Optional.of(inventories.get(0));
        }
        
        // If there are multiple records, merge them into one
        BloodInventory mergedInventory = new BloodInventory();
        mergedInventory.setBloodType(bloodType);
        mergedInventory.setQuantity(0);
        
        for (BloodInventory inventory : inventories) {
            mergedInventory.setQuantity(mergedInventory.getQuantity() + (inventory.getQuantity() != null ? inventory.getQuantity() : 0));
            // Keep the updatedBy from the first record
            if (mergedInventory.getUpdatedBy() == null) {
                mergedInventory.setUpdatedBy(inventory.getUpdatedBy());
            }
        }
        
        // Delete all duplicate records
        for (BloodInventory inventory : inventories) {
            bloodInventoryRepository.delete(inventory);
        }
        
        // Save the merged record
        BloodInventory savedInventory = bloodInventoryRepository.save(mergedInventory);
        return Optional.of(savedInventory);
    }

    @Override
    public BloodInventory save(BloodInventory inventory) {
        return bloodInventoryRepository.save(inventory);
    }

    @Override
    public BloodCompatibilityResponse checkBloodAvailabilityWithCompatibility(String bloodType, int requestedAmount) {
        // Check if the requested blood type is available
        Optional<BloodInventory> inventoryOpt = findByBloodType(bloodType);
        boolean isAvailable = false;
        Integer availableQuantity = 0;
        
        if (inventoryOpt.isPresent()) {
            BloodInventory inventory = inventoryOpt.get();
            availableQuantity = inventory.getQuantity() != null ? inventory.getQuantity() : 0;
            isAvailable = availableQuantity >= requestedAmount;
        }
        
        // Get all compatible blood types
        List<String> allCompatibleTypes = bloodCompatibilityService.getCompatibleBloodTypes(bloodType);
        
        // Get all inventory to check for compatible blood types
        List<BloodInventory> allInventory = getAll();
        var availableCompatibleTypes = bloodCompatibilityService.findAvailableCompatibleBlood(bloodType, allInventory);
        
        // Create response message
        String message;
        if (isAvailable) {
            message = "Nhóm máu " + bloodType + " có sẵn trong kho với số lượng: " + availableQuantity;
        } else {
            if (availableCompatibleTypes.isEmpty()) {
                message = "Nhóm máu " + bloodType + " không có sẵn và không có nhóm máu tương thích nào trong kho";
            } else {
                message = "Nhóm máu " + bloodType + " không đủ trong kho. Các nhóm máu tương thích có sẵn: " + 
                         String.join(", ", availableCompatibleTypes.keySet());
            }
        }
        
        return new BloodCompatibilityResponse(
            bloodType, 
            isAvailable, 
            availableQuantity, 
            allCompatibleTypes, 
            availableCompatibleTypes
        );
    }
}

