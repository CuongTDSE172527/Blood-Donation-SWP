package com.example.demo1.controller.donor;

import com.example.demo1.entity.DonationLocation;
import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.ProhibitedDisease;
import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.RegistrationStatus;
import com.example.demo1.repo.DonationLocationRepository;
import com.example.demo1.repo.DonationRegistrationRepository;
import com.example.demo1.repo.ProhibitedDiseaseRepository;
import com.example.demo1.repo.UserRepository;
import com.example.demo1.service.DonationRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
    private DonationLocationRepository locationRepo;

    @Autowired
    private ProhibitedDiseaseRepository diseaseRepo;

    @Autowired
    private DonationRegistrationRepository registrationRepo;

    /**
     * Donor đăng ký hiến máu
     */
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


    @Autowired
    private DonationRegistrationRepository registrationRepository;

    @PostMapping("/registrations")
    public ResponseEntity<?> createRegistration(@RequestBody DonationRegistration registration, Principal principal) {
        String email = principal.getName(); // Lấy email từ người đăng nhập
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        registration.setUser(userOpt.get());
        registration.setStatus(RegistrationStatus.PENDING);

        return ResponseEntity.ok(registrationRepository.save(registration));
    }

    /**
     * Donor xem lịch sử hiến máu (có thể lọc theo trạng thái)
     */
    @GetMapping("/history")
    public ResponseEntity<?> getDonationHistory(@RequestParam Long userId,
                                                @RequestParam(required = false) RegistrationStatus status) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (status != null) {
            return ResponseEntity.ok(
                    registrationRepo.findByUserIdAndStatus(userId, status)
            );
        } else {
            return ResponseEntity.ok(
                    registrationRepo.findByUserId(userId)
            );
        }
    }


    /**
     * Donor xem thông tin cá nhân
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        String email = principal.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(userOpt.get());
    }

    /**
     * Donor cập nhật thông tin cá nhân
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Principal principal, @RequestBody User updated) {
        String email = principal.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();

        if (updated.getFullName() != null) user.setFullName(updated.getFullName());
        if (updated.getPhone() != null) user.setPhone(updated.getPhone());
        if (updated.getDob() != null) user.setDob(updated.getDob());
        if (updated.getGender() != null) user.setGender(updated.getGender());
        if (updated.getAddress() != null) user.setAddress(updated.getAddress());
        if (updated.getBloodType() != null) user.setBloodType(updated.getBloodType());

        return ResponseEntity.ok(userRepository.save(user));
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = existingUserOpt.get();

        // Update fields except role
        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setDob(updatedUser.getDob());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setGender(updatedUser.getGender());

        // Save updated user
        User savedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }

    /**
     * Get all donation locations for registration
     */
    @GetMapping("/locations")
    public ResponseEntity<?> getAllLocations() {
        return ResponseEntity.ok(locationRepo.findAll());
    }

    /**
     * Get all prohibited diseases for registration
     */
    @GetMapping("/diseases")
    public ResponseEntity<?> getAllDiseases() {
        return ResponseEntity.ok(diseaseRepo.findAll());
    }
}
