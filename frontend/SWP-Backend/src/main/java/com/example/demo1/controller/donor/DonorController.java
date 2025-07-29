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
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> getProfile(@RequestParam(required = false) String email) {
        try {
            // Email is required
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            String userEmail = email.trim();
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found with email: " + userEmail);
            }
            return ResponseEntity.ok(userOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }

    /**
     * Donor cập nhật thông tin cá nhân
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updated) {
        try {
            // Email is required
            if (updated.getEmail() == null || updated.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            String userEmail = updated.getEmail().trim();
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found with email: " + userEmail);
            }

            User user = userOpt.get();

            // Update fields except password and email
            if (updated.getFullName() != null && !updated.getFullName().trim().isEmpty()) {
                user.setFullName(updated.getFullName().trim());
            }
            if (updated.getPhone() != null) {
                user.setPhone(updated.getPhone());
            }
            if (updated.getDob() != null) {
                user.setDob(updated.getDob());
            }
            if (updated.getGender() != null) {
                user.setGender(updated.getGender());
            }
            if (updated.getAddress() != null) {
                user.setAddress(updated.getAddress());
            }
            if (updated.getBloodType() != null) {
                user.setBloodType(updated.getBloodType());
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    /**
     * Donor cập nhật mật khẩu
     */
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> passwordData) {
        try {
            // Get email from request body
            String userEmail = passwordData.get("email");
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            userEmail = userEmail.trim();
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found with email: " + userEmail);
            }

            User user = userOpt.get();
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            // Validate current password (you might want to add password hashing here)
            if (!user.getPassword().equals(currentPassword)) {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }

            // Update password
            user.setPassword(newPassword);
            userRepository.save(user);

            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating password: " + e.getMessage());
        }
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
     * Create test donor user - DISABLED FOR PRODUCTION
     */
    /*
    @PostMapping("/create-test-user")
    public ResponseEntity<?> createTestUser() {
        try {
            // Check if test user already exists
            Optional<User> existingUser = userRepository.findByEmail("donor@example.com");
            if (existingUser.isPresent()) {
                return ResponseEntity.ok("Test user already exists: " + existingUser.get());
            }

            // Create test user
            User testUser = new User();
            testUser.setFullName("Test Donor");
            testUser.setEmail("donor@example.com");
            testUser.setPassword("password123");
            testUser.setPhone("0123456789");
            testUser.setBloodType("A+");
            testUser.setDob(java.time.LocalDate.of(1990, 1, 1));
            testUser.setGender(com.example.demo1.entity.enums.Gender.MALE);
            testUser.setAddress("123 Test Street, Test City");
            testUser.setRole(com.example.demo1.entity.enums.Role.DONOR);

            User savedUser = userRepository.save(testUser);
            return ResponseEntity.ok("Test user created: " + savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test user: " + e.getMessage());
        }
    }
    */

    /**
     * Get all users (for testing)
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching users: " + e.getMessage());
        }
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
