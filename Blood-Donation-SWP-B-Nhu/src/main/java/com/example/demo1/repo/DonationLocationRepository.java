package com.example.demo1.repo;

import com.example.demo1.entity.DonationLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationLocationRepository extends JpaRepository<DonationLocation, Long> {
}
