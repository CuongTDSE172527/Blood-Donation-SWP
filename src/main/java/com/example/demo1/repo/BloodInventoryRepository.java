package com.example.demo1.repo;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    Optional<BloodInventory> findByBloodType(String bloodType);
    List<BloodInventory> findByUpdatedBy(User user);
}
