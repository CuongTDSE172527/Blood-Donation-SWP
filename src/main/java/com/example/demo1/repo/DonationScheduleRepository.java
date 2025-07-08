package com.example.demo1.repo;

import com.example.demo1.entity.DonationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DonationScheduleRepository extends JpaRepository<DonationSchedule, Long> {
}
