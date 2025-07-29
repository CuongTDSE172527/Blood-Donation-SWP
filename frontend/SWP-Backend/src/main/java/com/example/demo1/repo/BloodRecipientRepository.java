package com.example.demo1.repo;

import com.example.demo1.entity.BloodRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRecipientRepository extends JpaRepository<BloodRecipient, Long> {
}
