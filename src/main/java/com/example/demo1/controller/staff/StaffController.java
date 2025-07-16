// StaffController.java
package com.example.demo1.controller.staff;

import com.example.demo1.entity.*;
import com.example.demo1.entity.enums.BloodRequestStatus;
import com.example.demo1.entity.enums.RegistrationStatus;
import com.example.demo1.entity.enums.Role;
import com.example.demo1.repo.*;
import com.example.demo1.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private BloodRequestRepository bloodRequestRepo;

    // === Địa điểm hiến máu ===

    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody DonationLocation location) {
        return ResponseEntity.ok(locationRepo.save(location));
    }

    // === Lịch hiến máu ===

    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedule(@RequestBody DonationSchedule schedule) {
        return ResponseEntity.ok(scheduleRepo.save(schedule));
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
        return ResponseEntity.ok(scheduleRepo.findAll());
    }

    // === Đăng ký hiến máu ===

    @GetMapping("/registrations/pending")
    public ResponseEntity<?> getPendingRegistrations() {
        return ResponseEntity.ok(registrationRepo.findByStatus(RegistrationStatus.PENDING));
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

        bloodInventoryRepo.findByBloodType(reg.getBloodType()).ifPresentOrElse(
                inv -> {
                    inv.setQuantity(inv.getQuantity() + reg.getAmount());
                    inv.setUpdatedBy(staff);
                    bloodInventoryRepo.save(inv);
                },
                () -> {
                    BloodInventory newInv = new BloodInventory();
                    newInv.setBloodType(reg.getBloodType());
                    newInv.setQuantity(reg.getAmount());
                    newInv.setUpdatedBy(staff);
                    bloodInventoryRepo.save(newInv);
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

    // === Người dùng ===

    @GetMapping("/users/donors")
    public ResponseEntity<?> getAllDonors() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DONOR));
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
        Optional<BloodInventory> inventoryOpt = bloodInventoryRepo.findByBloodType(req.getRecipientBloodType());

        if (inventoryOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy kho máu phù hợp");
        BloodInventory inventory = inventoryOpt.get();

        if (inventory.getQuantity() < req.getRequestedAmount()) return ResponseEntity.badRequest().body("Không đủ lượng máu trong kho");

        inventory.setQuantity(inventory.getQuantity() - req.getRequestedAmount());
        bloodInventoryRepo.save(inventory);

        req.setStatus(BloodRequestStatus.WAITING);
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


    @GetMapping("/donors/by-schedule/{scheduleId}")
    public ResponseEntity<?> getDonorsBySchedule(@PathVariable Long scheduleId) {
        Optional<DonationSchedule> scheduleOpt = scheduleRepo.findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }

        Long locationId = scheduleOpt.get().getLocation().getId();
        List<DonationRegistration> registrations = registrationRepo.findByLocationId(locationId);

        // Lấy danh sách User (Donor) từ các đăng ký
        List<User> donors = registrations.stream()
                .map(DonationRegistration::getUser)
                .distinct()
                .toList();

        return ResponseEntity.ok(donors);
    }

}
