package com.example.demo1.service;

import com.example.demo1.entity.DonationLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DonationLocationService {
    DonationLocation save(DonationLocation location);
    Optional<DonationLocation> findById(Long id);
    List<DonationLocation> findAll();
}
