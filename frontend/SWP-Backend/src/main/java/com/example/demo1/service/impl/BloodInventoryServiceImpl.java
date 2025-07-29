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
        return bloodInventoryRepository.findByBloodType(bloodType);
    }

    @Override
    public BloodInventory save(BloodInventory inventory) {
        return bloodInventoryRepository.save(inventory);
    }
}

