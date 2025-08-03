// StaffController.java
package com.example.demo1.controller.staff;

import com.example.demo1.entity.*;
import com.example.demo1.entity.enums.BloodRequestStatus;
import com.example.demo1.entity.enums.RegistrationStatus;
import com.example.demo1.entity.enums.Role;
import com.example.demo1.repo.*;
import com.example.demo1.service.BloodInventoryService;
import com.example.demo1.service.NotificationService;
import com.example.demo1.service.DonationEligibilityService;
import com.example.demo1.service.DonationNotificationService;
import com.example.demo1.dto.BloodCompatibilityResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.HashSet;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private DonationLocationRepository locationRepo;

    @Autowired
    private DonationScheduleRepository scheduleRepo;

    @Autowired
    private DonationRegistrationRepository registrationRepo;

    @Autowired
    private BloodInventoryRepository bloodInventoryRepo;
    
    @Autowired
    private BloodInventoryService bloodInventoryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private DonationEligibilityService eligibilityService;
    
    @Autowired
    private DonationNotificationService donationNotificationService;

    @Autowired
    private BloodRequestRepository bloodRequestRepo;

    // === Địa điểm hiến máu ===

    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody DonationLocation location) {
        try {
            System.out.println("Creating location: " + location);
            DonationLocation savedLocation = locationRepo.save(location);
            System.out.println("Location created with ID: " + savedLocation.getId());
            return ResponseEntity.ok(savedLocation);
        } catch (Exception e) {
            System.err.println("Error creating location: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating location: " + e.getMessage());
        }
    }

    @GetMapping("/locations")
    public ResponseEntity<?> getAllLocations() {
        return ResponseEntity.ok(locationRepo.findAll());
    }

    // === Lịch hiến máu ===

    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedule(@RequestBody DonationSchedule schedule) {
        try {
            System.out.println("Creating schedule: " + schedule);
            DonationSchedule savedSchedule = scheduleRepo.save(schedule);
            System.out.println("Schedule created with ID: " + savedSchedule.getId());
            return ResponseEntity.ok(savedSchedule);
        } catch (Exception e) {
            System.err.println("Error creating schedule: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating schedule: " + e.getMessage());
        }
    }

    @PutMapping("/schedules/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody DonationSchedule update) {
        Optional<DonationSchedule> optional = scheduleRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }
        DonationSchedule schedule = optional.get();
        schedule.setDate(update.getDate());
        schedule.setTime(update.getTime());
        return ResponseEntity.ok(scheduleRepo.save(schedule));
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        if (!scheduleRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }
        scheduleRepo.deleteById(id);
        return ResponseEntity.ok("Schedule deleted successfully");
    }

    @GetMapping("/schedules")
    public ResponseEntity<?> getAllSchedules() {
        try {
            List<DonationSchedule> schedules = scheduleRepo.findAll();
            System.out.println("Found " + schedules.size() + " schedules");
            
            if (schedules.isEmpty()) {
                System.out.println("No schedules found in database");
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            // Add registration count for each schedule
            List<Map<String, Object>> result = schedules.stream()
                    .map(schedule -> {
                        Map<String, Object> scheduleInfo = new HashMap<>();
                        scheduleInfo.put("id", schedule.getId());
                        scheduleInfo.put("date", schedule.getDate());
                        scheduleInfo.put("time", schedule.getTime());
                        scheduleInfo.put("location", schedule.getLocation());
                        
                        // Count registrations for this schedule's location
                        if (schedule.getLocation() != null) {
                            Long locationId = schedule.getLocation().getId();
                            List<DonationRegistration> registrations = registrationRepo.findByLocationId(locationId);
                            scheduleInfo.put("registrationCount", registrations.size());
                        } else {
                            scheduleInfo.put("registrationCount", 0);
                        }
                        
                        return scheduleInfo;
                    })
                    .toList();
            
            System.out.println("Returning " + result.size() + " schedules with registration counts");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error in getAllSchedules: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error loading schedules: " + e.getMessage());
        }
    }

    // === Đăng ký hiến máu ===

    @GetMapping("/registrations/pending")
    public ResponseEntity<?> getPendingRegistrations() {
        return ResponseEntity.ok(registrationRepo.findByStatus(RegistrationStatus.PENDING));
    }

    @PostMapping("/registrations")
    public ResponseEntity<?> createRegistration(@RequestBody Map<String, Object> body) {
        try {
            // Check for prohibited diseases first
            if (body.containsKey("diseaseIds")) {
                List<Long> diseaseIds = ((List<?>) body.get("diseaseIds")).stream()
                        .map(id -> Long.parseLong(id.toString()))
                        .collect(Collectors.toList());
                
                if (!diseaseIds.isEmpty()) {
                    List<ProhibitedDisease> selectedDiseases = diseaseRepo.findAllById(diseaseIds);
                    if (!selectedDiseases.isEmpty()) {
                        String diseaseNames = selectedDiseases.stream()
                                .map(ProhibitedDisease::getName)
                                .collect(Collectors.joining(", "));
                        return ResponseEntity.badRequest().body(
                            "You cannot donate blood if you have the following conditions: " + diseaseNames + 
                            ". Please consult with a healthcare provider."
                        );
                    }
                }
            }

            // Create registration
            DonationRegistration reg = new DonationRegistration();
            
            // Basic information
            reg.setBloodType((String) body.get("bloodType"));
            if (body.get("lastDonationDate") != null && !body.get("lastDonationDate").toString().isEmpty()) {
                reg.setLastDonationDate(LocalDate.parse((String) body.get("lastDonationDate")));
            }
            double weight = Double.parseDouble(body.get("weight").toString());
            double height = Double.parseDouble(body.get("height").toString());
            reg.setWeight(weight);
            reg.setHeight(height);
            
            // Calculate and store BMI
            double heightInMeters = height / 100.0;
            double bmi = weight / (heightInMeters * heightInMeters);
            reg.setBmi(Math.round(bmi * 10.0) / 10.0); // Round to 1 decimal place
            reg.setAmount(Integer.parseInt(body.get("amount").toString()));
            
            // Health screening data
            if (body.containsKey("bloodPressure")) {
                Map<String, Object> bp = (Map<String, Object>) body.get("bloodPressure");
                if (bp.get("systolic") != null && !bp.get("systolic").toString().isEmpty()) {
                    reg.setSystolicBP(Integer.parseInt(bp.get("systolic").toString()));
                }
                if (bp.get("diastolic") != null && !bp.get("diastolic").toString().isEmpty()) {
                    reg.setDiastolicBP(Integer.parseInt(bp.get("diastolic").toString()));
                }
            }
            
            if (body.containsKey("heartRate") && body.get("heartRate") != null && !body.get("heartRate").toString().isEmpty()) {
                reg.setHeartRate(Integer.parseInt(body.get("heartRate").toString()));
            }
            
            if (body.containsKey("temperature") && body.get("temperature") != null && !body.get("temperature").toString().isEmpty()) {
                reg.setTemperature(Double.parseDouble(body.get("temperature").toString()));
            }
            
            if (body.containsKey("hemoglobin") && body.get("hemoglobin") != null && !body.get("hemoglobin").toString().isEmpty()) {
                reg.setHemoglobin(Double.parseDouble(body.get("hemoglobin").toString()));
            }
            
            // Medication and surgery history
            if (body.containsKey("currentMedications")) {
                reg.setCurrentMedications((String) body.get("currentMedications"));
            }
            
            if (body.containsKey("recentSurgery")) {
                reg.setRecentSurgery((Boolean) body.get("recentSurgery"));
                if (Boolean.TRUE.equals(reg.getRecentSurgery())) {
                    if (body.containsKey("surgeryDetails")) {
                        reg.setSurgeryDetails((String) body.get("surgeryDetails"));
                    }
                    if (body.containsKey("surgeryDate") && body.get("surgeryDate") != null && !body.get("surgeryDate").toString().isEmpty()) {
                        reg.setSurgeryDate(LocalDate.parse((String) body.get("surgeryDate")));
                    }
                }
            }
            
            // Risk factors
            if (body.containsKey("recentTravel")) {
                reg.setRecentTravel((Boolean) body.get("recentTravel"));
                if (Boolean.TRUE.equals(reg.getRecentTravel()) && body.containsKey("travelDetails")) {
                    reg.setTravelDetails((String) body.get("travelDetails"));
                }
            }
            
            if (body.containsKey("recentTattoo")) {
                reg.setRecentTattoo((Boolean) body.get("recentTattoo"));
                if (Boolean.TRUE.equals(reg.getRecentTattoo()) && body.containsKey("tattooDate") && body.get("tattooDate") != null && !body.get("tattooDate").toString().isEmpty()) {
                    reg.setTattooDate(LocalDate.parse((String) body.get("tattooDate")));
                }
            }
            
            if (body.containsKey("recentPiercing")) {
                reg.setRecentPiercing((Boolean) body.get("recentPiercing"));
                if (Boolean.TRUE.equals(reg.getRecentPiercing()) && body.containsKey("piercingDate") && body.get("piercingDate") != null && !body.get("piercingDate").toString().isEmpty()) {
                    reg.setPiercingDate(LocalDate.parse((String) body.get("piercingDate")));
                }
            }
            
            // Women's health
            if (body.containsKey("isPregnant")) {
                reg.setIsPregnant((Boolean) body.get("isPregnant"));
            }
            if (body.containsKey("isBreastfeeding")) {
                reg.setIsBreastfeeding((Boolean) body.get("isBreastfeeding"));
            }
            
            // Consent forms
            if (body.containsKey("healthDeclaration")) {
                reg.setHealthDeclaration((Boolean) body.get("healthDeclaration"));
            }
            if (body.containsKey("consentForm")) {
                reg.setConsentForm((Boolean) body.get("consentForm"));
            }
            if (body.containsKey("dataProcessing")) {
                reg.setDataProcessingConsent((Boolean) body.get("dataProcessing"));
            }

            // Set location
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

            // Set user
            if (body.containsKey("userId")) {
                Long userId = Long.parseLong(body.get("userId").toString());
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("User not found");
                }
                reg.setUser(userOpt.get());
            } else {
                return ResponseEntity.badRequest().body("User ID is required");
            }

            // Set empty diseases set since validation passed
            reg.setDiseases(new HashSet<>());
            
            // Get user for eligibility check
            User user = reg.getUser();
            
            // Perform comprehensive eligibility check
            DonationEligibilityService.EligibilityResult eligibilityResult = eligibilityService.checkEligibility(reg, user);
            
            if (!eligibilityResult.isEligible()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "eligible", false,
                    "errors", eligibilityResult.getErrors(),
                    "warnings", eligibilityResult.getWarnings()
                ));
            }
            
            // Set eligibility status and notes
            reg.setEligibilityStatus(true);
            if (!eligibilityResult.getWarnings().isEmpty()) {
                reg.setEligibilityNotes(String.join("; ", eligibilityResult.getWarnings()));
            }
            
            reg.setStatus(RegistrationStatus.PENDING);

            DonationRegistration savedReg = registrationRepo.save(reg);
            
            // Send confirmation notification
            try {
                donationNotificationService.sendRegistrationConfirmation(savedReg);
                
                // If there are warnings, send additional notification
                if (!eligibilityResult.getWarnings().isEmpty()) {
                    String warningMessage = String.join("; ", eligibilityResult.getWarnings());
                    donationNotificationService.sendEligibilityResult(savedReg, true, warningMessage);
                }
            } catch (Exception e) {
                System.err.println("Failed to send notification: " + e.getMessage());
                // Continue processing even if notification fails
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "registration", savedReg,
                "eligible", true,
                "warnings", eligibilityResult.getWarnings(),
                "message", "Registration submitted successfully! " + 
                          (eligibilityResult.getWarnings().isEmpty() ? 
                           "You will receive a confirmation email shortly." :
                           "Please note the warnings and consult with medical staff.")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating registration: " + e.getMessage());
        }
    }

    @PostMapping("/registrations/{id}/confirm")
    public ResponseEntity<?> confirmRegistration(@PathVariable Long id, @RequestParam Long staffId) {
        Optional<DonationRegistration> opt = registrationRepo.findById(id);
        Optional<User> staffOpt = userRepository.findById(staffId);

        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Registration not found");
        if (staffOpt.isEmpty()) return ResponseEntity.badRequest().body("Staff not found");

        DonationRegistration reg = opt.get();
        User staff = staffOpt.get();

        reg.setStatus(RegistrationStatus.CONFIRMED);
        registrationRepo.save(reg);

        bloodInventoryService.findByBloodType(reg.getBloodType()).ifPresentOrElse(
                inv -> {
                    inv.setQuantity(inv.getQuantity() + reg.getAmount());
                    inv.setUpdatedBy(staff);
                    bloodInventoryService.save(inv);
                },
                () -> {
                    BloodInventory newInv = new BloodInventory();
                    newInv.setBloodType(reg.getBloodType());
                    newInv.setQuantity(reg.getAmount());
                    newInv.setUpdatedBy(staff);
                    bloodInventoryService.save(newInv);
                }
        );

        notificationService.sendNotification(reg.getUser().getEmail(), "Đơn đăng ký hiến máu đã được xác nhận.");
        return ResponseEntity.ok("Confirmed and inventory updated");
    }

    @PostMapping("/registrations/{id}/cancel")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        return registrationRepo.findById(id).map(reg -> {
            reg.setStatus(RegistrationStatus.CANCELLED);
            registrationRepo.save(reg);
            notificationService.sendNotification(reg.getUser().getEmail(), "Đơn đăng ký hiến máu đã bị hủy.");
            return ResponseEntity.ok("Registration cancelled");
        }).orElse(ResponseEntity.badRequest().body("Registration not found"));
    }

    // === Kho máu ===

    @GetMapping("/inventory")
    public ResponseEntity<?> getBloodInventory() {
        return ResponseEntity.ok(bloodInventoryRepo.findAll());
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<?> updateBloodInventory(@PathVariable Long id, @RequestBody BloodInventory updated) {
        Optional<BloodInventory> optional = bloodInventoryRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Blood inventory not found");
        }

        BloodInventory inv = optional.get();
        if (updated.getQuantity() != null) {
            inv.setQuantity(updated.getQuantity());
        }
        return ResponseEntity.ok(bloodInventoryRepo.save(inv));
    }

    @PostMapping("/inventory")
    public ResponseEntity<?> addBloodInventory(@RequestBody BloodInventory inventory) {
        return ResponseEntity.ok(bloodInventoryRepo.save(inventory));
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<?> deleteBloodInventory(@PathVariable Long id) {
        if (!bloodInventoryRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Blood inventory not found");
        }
        bloodInventoryRepo.deleteById(id);
        return ResponseEntity.ok("Blood inventory deleted successfully");
    }

    // === Người dùng ===

    @GetMapping("/users/donors")
    public ResponseEntity<?> getAllDonors() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DONOR));
    }

    @PostMapping("/users/donors")
    public ResponseEntity<?> createDonor(@RequestBody User donor) {
        try {
            // Set role to DONOR
            donor.setRole(Role.DONOR);
            
            // Check if email already exists
            if (userRepository.findByEmail(donor.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            User savedDonor = userRepository.save(donor);
            return ResponseEntity.ok(savedDonor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating donor: " + e.getMessage());
        }
    }

    @PutMapping("/users/donors/{id}")
    public ResponseEntity<?> updateDonor(@PathVariable Long id, @RequestBody User updatedDonor) {
        try {
            Optional<User> existingDonorOpt = userRepository.findById(id);
            if (existingDonorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Donor not found");
            }

            User existingDonor = existingDonorOpt.get();
            
            // Update fields except role and email
            if (updatedDonor.getFullName() != null) {
                existingDonor.setFullName(updatedDonor.getFullName());
            }
            if (updatedDonor.getPhone() != null) {
                existingDonor.setPhone(updatedDonor.getPhone());
            }
            if (updatedDonor.getDob() != null) {
                existingDonor.setDob(updatedDonor.getDob());
            }
            if (updatedDonor.getGender() != null) {
                existingDonor.setGender(updatedDonor.getGender());
            }
            if (updatedDonor.getAddress() != null) {
                existingDonor.setAddress(updatedDonor.getAddress());
            }
            if (updatedDonor.getBloodType() != null) {
                existingDonor.setBloodType(updatedDonor.getBloodType());
            }
            if (updatedDonor.getPassword() != null && !updatedDonor.getPassword().trim().isEmpty()) {
                existingDonor.setPassword(updatedDonor.getPassword());
            }

            User savedDonor = userRepository.save(existingDonor);
            return ResponseEntity.ok(savedDonor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating donor: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/donors/{id}")
    public ResponseEntity<?> deleteDonor(@PathVariable Long id) {
        try {
            Optional<User> donorOpt = userRepository.findById(id);
            if (donorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Donor not found");
            }

            User donor = donorOpt.get();
            if (donor.getRole() != Role.DONOR) {
                return ResponseEntity.badRequest().body("User is not a donor");
            }

            userRepository.deleteById(id);
            return ResponseEntity.ok("Donor deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting donor: " + e.getMessage());
        }
    }

    @GetMapping("/users/medicalcenters")
    public ResponseEntity<?> getAllMedicalCenters() {
        return ResponseEntity.ok(userRepository.findByRole(Role.MEDICALCENTER));
    }

    @GetMapping("/users/donors/{id}")
    public ResponseEntity<?> getDonorById(@PathVariable Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.DONOR)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Donor not found"));
    }

    @GetMapping("/users/medicalcenters/{id}")
    public ResponseEntity<?> getMedicalCenterById(@PathVariable Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.MEDICALCENTER)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Medical center not found"));
    }

    // === Yêu cầu nhận máu từ medical center ===

    @GetMapping("/blood-requests")
    public ResponseEntity<?> getAllBloodRequests() {
        return ResponseEntity.ok(bloodRequestRepo.findAll());
    }

    @PostMapping("/blood-requests/{id}/confirm")
    public ResponseEntity<?> confirmBloodRequest(@PathVariable Long id) {
        Optional<BloodRequest> opt = bloodRequestRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Request not found");

        BloodRequest req = opt.get();
        Optional<BloodInventory> inventoryOpt = bloodInventoryService.findByBloodType(req.getRecipientBloodType());

        if (inventoryOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy kho máu phù hợp");
        BloodInventory inventory = inventoryOpt.get();

        if (inventory.getQuantity() < req.getRequestedAmount()) return ResponseEntity.badRequest().body("Không đủ lượng máu trong kho");

        inventory.setQuantity(inventory.getQuantity() - req.getRequestedAmount());
        bloodInventoryService.save(inventory);

        // Logic cập nhật trạng thái dựa trên trạng thái hiện tại
        BloodRequestStatus newStatus;
        if (req.getStatus() == BloodRequestStatus.PENDING || req.getStatus() == BloodRequestStatus.WAITING) {
            newStatus = BloodRequestStatus.CONFIRM; // Chuyển thành đã xác nhận
        } else {
            newStatus = BloodRequestStatus.WAITING; // Giữ logic cũ cho các trạng thái khác
        }
        
        req.setStatus(newStatus);
        bloodRequestRepo.save(req);

        notificationService.sendNotification(req.getMedicalCenter().getEmail(), "Yêu cầu nhận máu đã được xác nhận.");
        return ResponseEntity.ok("Request confirmed and blood updated");
    }

    @PostMapping("/blood-requests/{id}/mark-priority")
    public ResponseEntity<?> markPriority(@PathVariable Long id) {
        return updateRequestStatus(id, BloodRequestStatus.PRIORITY, "Yêu cầu của bạn đã được đánh dấu là ưu tiên.");
    }

    @PostMapping("/blood-requests/{id}/mark-out-of-stock")
    public ResponseEntity<?> markOutOfStock(@PathVariable Long id) {
        return updateRequestStatus(id, BloodRequestStatus.OUT_OF_STOCK, "Rất tiếc, hiện không đủ máu đáp ứng yêu cầu của bạn.");
    }

    private ResponseEntity<?> updateRequestStatus(Long id, BloodRequestStatus status, String message) {
        return bloodRequestRepo.findById(id).map(req -> {
            req.setStatus(status);
            bloodRequestRepo.save(req);
            notificationService.sendNotification(req.getMedicalCenter().getEmail(), message);
            return ResponseEntity.ok("Status updated");
        }).orElse(ResponseEntity.badRequest().body("Request not found"));
    }


    // Thêm ở đầu class StaffController
    @Autowired
    private ProhibitedDiseaseRepository diseaseRepo;

// === Quản lý bệnh bị cấm hiến máu ===

    @PostMapping("/diseases")
    public ResponseEntity<?> createDisease(@RequestBody ProhibitedDisease disease) {
        return ResponseEntity.ok(diseaseRepo.save(disease));
    }

    @PutMapping("/diseases/{id}")
    public ResponseEntity<?> updateDisease(@PathVariable Long id, @RequestBody ProhibitedDisease updated) {
        Optional<ProhibitedDisease> optional = diseaseRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Disease not found");
        }

        ProhibitedDisease disease = optional.get();
        if (updated.getName() != null) {
            disease.setName(updated.getName());
        }
        if (updated.getDescription() != null) {
            disease.setDescription(updated.getDescription());
        }

        return ResponseEntity.ok(diseaseRepo.save(disease));
    }

    @DeleteMapping("/diseases/{id}")
    public ResponseEntity<?> deleteDisease(@PathVariable Long id) {
        if (!diseaseRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Disease not found");
        }
        diseaseRepo.deleteById(id);
        return ResponseEntity.ok("Disease deleted successfully");
    }

    @GetMapping("/diseases")
    public ResponseEntity<?> getAllDiseases() {
        return ResponseEntity.ok(diseaseRepo.findAll());
    }

    // === Blood Compatibility Check ===
    @GetMapping("/blood-compatibility/{bloodType}")
    public ResponseEntity<?> checkBloodCompatibility(@PathVariable String bloodType, 
                                                   @RequestParam(defaultValue = "1") int requestedAmount) {
        try {
            BloodCompatibilityResponse response = bloodInventoryService.checkBloodAvailabilityWithCompatibility(bloodType, requestedAmount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking blood compatibility: " + e.getMessage());
        }
    }


    @GetMapping("/donors/by-schedule/{scheduleId}")
    public ResponseEntity<?> getDonorsBySchedule(@PathVariable Long scheduleId) {
        Optional<DonationSchedule> scheduleOpt = scheduleRepo.findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }

        Long locationId = scheduleOpt.get().getLocation().getId();
        List<DonationRegistration> registrations = registrationRepo.findByLocationId(locationId);

        // Tạo danh sách kết quả với thông tin đầy đủ
        List<Map<String, Object>> result = registrations.stream()
                .map(registration -> {
                    Map<String, Object> donorInfo = new HashMap<>();
                    User user = registration.getUser();
                    
                    donorInfo.put("id", registration.getId());
                    donorInfo.put("user", user);
                    donorInfo.put("status", registration.getStatus());
                    donorInfo.put("registrationDate", registration.getRegisteredAt());
                    donorInfo.put("donorName", user.getFullName());
                    donorInfo.put("email", user.getEmail());
                    donorInfo.put("phone", user.getPhone());
                    donorInfo.put("bloodType", user.getBloodType());
                    
                    return donorInfo;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

}
