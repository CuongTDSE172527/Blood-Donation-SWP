package com.example.demo1.service;

import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.User;

import java.util.List;

public interface DonationRegistrationService {
    DonationRegistration register(DonationRegistration registration, User user);
    List<DonationRegistration> getRegistrationsByUser(User user);
}
