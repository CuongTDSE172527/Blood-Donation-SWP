// === Repository: DonationRegistrationRepository.java ===
package com.example.demo1.repo;

import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRegistrationRepository extends JpaRepository<DonationRegistration, Long> {
    List<DonationRegistration> findByUser(User user);
    List<DonationRegistration> findByStatus(RegistrationStatus status);

    List<DonationRegistration> findByUserId(Long userId);

    List<DonationRegistration> findByUserIdAndStatus(Long userId, RegistrationStatus status);
    List<DonationRegistration> findByLocationId(Long locationId);
    List<DonationRegistration> findByLocation_Id(Long locationId);

}