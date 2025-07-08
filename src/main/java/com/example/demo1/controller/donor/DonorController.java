package com.example.demo1.controller.donor;

import com.example.demo1.entity.DonationLocation;
import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.ProhibitedDisease;
import com.example.demo1.entity.User;
import com.example.demo1.repo.DonationLocationRepository;
import com.example.demo1.repo.ProhibitedDiseaseRepository;
import com.example.demo1.repo.UserRepository;
import com.example.demo1.service.DonationRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donor")
public class DonorController {

    @Autowired
    private DonationRegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProhibitedDiseaseRepository diseaseRepo;

    @Autowired
    private DonationLocationRepository locationRepo;

    @PostMapping("/register")
    public ResponseEntity<?> registerDonation(@RequestParam Long userId,
                                              @RequestBody Map<String, Object> body) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        DonationRegistration reg = new DonationRegistration();
        reg.setBloodType((String) body.get("bloodType"));
        reg.setLastDonationDate(LocalDate.parse((String) body.get("lastDonationDate")));
        reg.setWeight(Double.parseDouble(body.get("weight").toString()));
        reg.setHeight(Double.parseDouble(body.get("height").toString()));
        reg.setAmount(Integer.parseInt(body.get("amount").toString()));

        if (body.containsKey("locationId")) {
            Long locationId = Long.parseLong(body.get("locationId").toString());
            Optional<DonationLocation> locOpt = locationRepo.findById(locationId);
            if (locOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Location not found");
            }
            reg.setLocation(locOpt.get());
        } else {
            return ResponseEntity.badRequest().body("Location is required");
        }

        if (body.containsKey("diseaseIds")) {
            List<Long> diseaseIds = ((List<?>) body.get("diseaseIds")).stream()
                    .map(id -> Long.parseLong(id.toString()))
                    .collect(Collectors.toList());
            Set<ProhibitedDisease> diseases = new HashSet<>(diseaseRepo.findAllById(diseaseIds));
            reg.setDiseases(diseases);
        }

        return ResponseEntity.ok(registrationService.register(reg, userOpt.get()));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getDonationHistory(@RequestParam Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(registrationService.getRegistrationsByUser(userOpt.get()));
    }
}
