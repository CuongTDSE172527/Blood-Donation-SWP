package com.example.demo1.repo;

import com.example.demo1.entity.ProhibitedDisease;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProhibitedDiseaseRepository extends JpaRepository<ProhibitedDisease, Long> {
}
