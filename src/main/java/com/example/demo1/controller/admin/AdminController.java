package com.example.demo1.controller.admin;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.entity.BloodRequest;
import com.example.demo1.entity.DonationSchedule;
import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.BloodRequestStatus;
import com.example.demo1.entity.enums.Role;
import com.example.demo1.repo.BloodInventoryRepository;
import com.example.demo1.repo.BloodRequestRepository;
import com.example.demo1.repo.DonationScheduleRepository;
import com.example.demo1.repo.UserRepository;
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

}
