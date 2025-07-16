package com.example.demo1.controller.admin;

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
@RequestMapping("/api/admin") // Tiền tố URL cho tất cả API trong controller này
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationScheduleRepository scheduleRepo;

    // ==== QUẢN LÝ NGƯỜI DÙNG ====

    // Lấy danh sách tài khoản ADMIN
    @GetMapping("/users/admins")
    public ResponseEntity<List<User>> getAdmins() {
        return ResponseEntity.ok(userRepository.findByRole(Role.ADMIN));
    }

    // Lấy danh sách tài khoản DONOR
    @GetMapping("/users/donors")
    public ResponseEntity<List<User>> getDonors() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DONOR));
    }

    // Lấy danh sách tài khoản STAFF
    @GetMapping("/users/staff")
    public ResponseEntity<List<User>> getStaffs() {
        return ResponseEntity.ok(userRepository.findByRole(Role.STAFF));
    }

    // Lấy chi tiết một tài khoản bất kỳ theo ID
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("User not found"));
    }

    // Lấy danh sách tài khoản MEDICALCENTER
    @GetMapping("/users/medicalcenters")
    public ResponseEntity<List<User>> getMedicalCenters() {
        return ResponseEntity.ok(userRepository.findByRole(Role.MEDICALCENTER));
    }

    // Lấy chi tiết tài khoản MEDICALCENTER theo ID
    @GetMapping("/users/medicalcenters/{id}")
    public ResponseEntity<?> getMedicalCenterById(@PathVariable Long id) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == Role.MEDICALCENTER)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Medical center not found"));
    }

    // ==== QUẢN LÝ LỊCH HIẾN MÁU ====

    // Tạo lịch hiến máu mới
    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedule(@RequestBody DonationSchedule schedule) {
        return ResponseEntity.ok(scheduleRepo.save(schedule));
    }

    // Cập nhật lịch hiến máu
    @PutMapping("/schedules/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody DonationSchedule update) {
        Optional<DonationSchedule> optionalSchedule = scheduleRepo.findById(id);
        if (optionalSchedule.isEmpty()) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }

        DonationSchedule schedule = optionalSchedule.get();

        // Cập nhật các trường nếu không null
        if (update.getDate() != null) {
            schedule.setDate(update.getDate());
        }

        if (update.getTime() != null) {
            schedule.setTime(update.getTime());
        }

        if (update.getLocation() != null && update.getLocation().getId() != null) {
            schedule.setLocation(update.getLocation());
        }

        return ResponseEntity.ok(scheduleRepo.save(schedule));
    }

    // Lấy danh sách tất cả các lịch hiến máu
    @GetMapping("/schedules")
    public ResponseEntity<?> getAllSchedules() {
        return ResponseEntity.ok(scheduleRepo.findAll());
    }

    // Xóa lịch hiến máu theo ID
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        if (!scheduleRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }
        scheduleRepo.deleteById(id);
        return ResponseEntity.ok("Schedule deleted successfully");
    }

    @PostMapping("/users/medicalcenters")
    public ResponseEntity<?> createMedicalCenter(@RequestBody User user) {
        user.setRole(Role.MEDICALCENTER);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/medicalcenters/{id}")
    public ResponseEntity<?> updateMedicalCenter(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty() || optional.get().getRole() != Role.MEDICALCENTER) {
            return ResponseEntity.badRequest().body("Medical center not found");
        }

        User user = optional.get();

        if (updatedUser.getFullName() != null) {
            user.setFullName(updatedUser.getFullName());
        }

        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }

        if (updatedUser.getPhone() != null) {
            user.setPhone(updatedUser.getPhone());
        }

        return ResponseEntity.ok(userRepository.save(user));
    }


    @PostMapping("/users/staff")
    public ResponseEntity<?> createStaff(@RequestBody User staff) {
        staff.setRole(Role.STAFF); // Gán role là STAFF
        return ResponseEntity.ok(userRepository.save(staff));
    }


    @PutMapping("/users/staff/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty() || optional.get().getRole() != Role.STAFF) {
            return ResponseEntity.badRequest().body("Staff not found");
        }

        User user = optional.get();

        if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getDob() != null) user.setDob(updatedUser.getDob());
        if (updatedUser.getGender() != null) user.setGender(updatedUser.getGender());

        return ResponseEntity.ok(userRepository.save(user));
    }
    @Autowired
    private BloodInventoryRepository bloodInventoryRepo;

    @GetMapping("/inventory")
    public ResponseEntity<?> getAllBloodInventory() {
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
    @Autowired
    private BloodRequestRepository bloodRequestRepo;

    @GetMapping("/blood-requests")
    public ResponseEntity<?> getAllBloodRequests() {
        return ResponseEntity.ok(bloodRequestRepo.findAll());
    }
    @PutMapping("/blood-requests/{id}/confirm")
    public ResponseEntity<?> confirmBloodRequest(@PathVariable Long id) {
        Optional<BloodRequest> optional = bloodRequestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Request not found");
        }

        BloodRequest req = optional.get();
        req.setStatus(BloodRequestStatus.WAITING);
        return ResponseEntity.ok(bloodRequestRepo.save(req));
    }

    @PutMapping("/blood-requests/{id}/mark-out-of-stock")
    public ResponseEntity<?> markOutOfStock(@PathVariable Long id) {
        Optional<BloodRequest> optional = bloodRequestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Request not found");
        }

        BloodRequest req = optional.get();
        req.setStatus(BloodRequestStatus.OUT_OF_STOCK);
        return ResponseEntity.ok(bloodRequestRepo.save(req));
    }


    // THÊM Ở TRÊN CÙNG
    @Autowired
    private DonationLocationRepository locationRepo;

    @Autowired
    private DonationRegistrationRepository registrationRepo;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody DonationLocation location) {
        return ResponseEntity.ok(locationRepo.save(location));
    }
    @GetMapping("/registrations/pending")
    public ResponseEntity<?> getPendingRegistrations() {
        return ResponseEntity.ok(registrationRepo.findByStatus(RegistrationStatus.PENDING));
    }

    @PostMapping("/registrations/{id}/confirm")
    public ResponseEntity<?> confirmRegistration(@PathVariable Long id, @RequestParam Long adminId) {
        Optional<DonationRegistration> opt = registrationRepo.findById(id);
        Optional<User> adminOpt = userRepository.findById(adminId);

        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Registration not found");
        if (adminOpt.isEmpty()) return ResponseEntity.badRequest().body("Admin not found");

        DonationRegistration reg = opt.get();
        User admin = adminOpt.get();

        reg.setStatus(RegistrationStatus.CONFIRMED);
        registrationRepo.save(reg);

        bloodInventoryRepo.findByBloodType(reg.getBloodType()).ifPresentOrElse(
                inv -> {
                    inv.setQuantity(inv.getQuantity() + reg.getAmount());
                    inv.setUpdatedBy(admin);
                    bloodInventoryRepo.save(inv);
                },
                () -> {
                    BloodInventory newInv = new BloodInventory();
                    newInv.setBloodType(reg.getBloodType());
                    newInv.setQuantity(reg.getAmount());
                    newInv.setUpdatedBy(admin);
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
    @PostMapping("/blood-requests/{id}/confirm")
    public ResponseEntity<?> confirmBloodRequestWithInventory(@PathVariable Long id) {
        Optional<BloodRequest> opt = bloodRequestRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Request not found");

        BloodRequest req = opt.get();
        Optional<BloodInventory> inventoryOpt = bloodInventoryRepo.findByBloodType(req.getRecipientBloodType());

        if (inventoryOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy kho máu phù hợp");
        BloodInventory inventory = inventoryOpt.get();

        if (inventory.getQuantity() < req.getRequestedAmount())
            return ResponseEntity.badRequest().body("Không đủ lượng máu trong kho");

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

    @PostMapping("/blood-requests/{id}/mark-out-of-stock-admin")
    public ResponseEntity<?> markOutOfStockByAdmin(@PathVariable Long id) {
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
    @Autowired
    private ProhibitedDiseaseRepository diseaseRepo;

    @GetMapping("/diseases")
    public ResponseEntity<?> getAllDiseases() {
        return ResponseEntity.ok(diseaseRepo.findAll());
    }

    @PostMapping("/diseases")
    public ResponseEntity<?> createDisease(@RequestBody ProhibitedDisease disease) {
        return ResponseEntity.ok(diseaseRepo.save(disease));
    }

    @PutMapping("/diseases/{id}")
    public ResponseEntity<?> updateDisease(@PathVariable Long id, @RequestBody ProhibitedDisease update) {
        Optional<ProhibitedDisease> optional = diseaseRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Disease not found");
        }

        ProhibitedDisease disease = optional.get();
        if (update.getName() != null) disease.setName(update.getName());
        if (update.getDescription() != null) disease.setDescription(update.getDescription());

        return ResponseEntity.ok(diseaseRepo.save(disease));
    }


    @DeleteMapping("/diseases/{id}")
    public ResponseEntity<?> deleteDisease(@PathVariable Long id) {
        if (!diseaseRepo.existsById(id)) return ResponseEntity.badRequest().body("Disease not found");
        diseaseRepo.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
    @GetMapping("/donors/by-schedule/{scheduleId}")
    public ResponseEntity<?> getDonorsBySchedule(@PathVariable Long scheduleId) {
        List<DonationRegistration> regs = registrationRepo.findByLocation_Id(scheduleId);
        List<User> donors = regs.stream()
                .map(DonationRegistration::getUser)
                .distinct()
                .toList();
        return ResponseEntity.ok(donors);
    }

}
