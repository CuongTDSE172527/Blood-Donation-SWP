package com.example.demo1.service.impl;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.repo.BloodInventoryRepository;
import com.example.demo1.service.BloodInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BloodInventoryServiceImpl implements BloodInventoryService {

    @Autowired
    private BloodInventoryRepository bloodInventoryRepository;

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
}

