package com.example.demo1.controller.admin;

import com.example.demo1.entity.DonationSchedule;
import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.Role;
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
}
