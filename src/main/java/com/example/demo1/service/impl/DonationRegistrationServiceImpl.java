// === Service Impl: DonationRegistrationServiceImpl.java ===
package com.example.demo1.service.impl;

import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.User;
import com.example.demo1.repo.DonationRegistrationRepository;
import com.example.demo1.service.DonationRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationRegistrationServiceImpl implements DonationRegistrationService {

    @Autowired
    private DonationRegistrationRepository registrationRepository;

    @Override
    public DonationRegistration register(DonationRegistration registration, User user) {
        registration.setUser(user);
        registration.setRegisteredAt(LocalDateTime.now());
        return registrationRepository.save(registration);
    }

    @Override
    public List<DonationRegistration> getRegistrationsByUser(User user) {
        return registrationRepository.findByUser(user);
    }
}