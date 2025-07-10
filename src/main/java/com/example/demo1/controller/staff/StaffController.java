package com.example.demo1.controller.staff;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.entity.DonationLocation;
import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.DonationSchedule;
import com.example.demo1.entity.enums.RegistrationStatus;
import com.example.demo1.entity.enums.Role;
import com.example.demo1.repo.*;
import com.example.demo1.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // --- Tạo địa điểm ---
    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody DonationLocation location) {
        return ResponseEntity.ok(locationRepo.save(location));
    }

    // --- Chỉnh sửa địa điểm ---
    @PutMapping("/locations/{id}")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody DonationLocation update) {
        Optional<DonationLocation> optionalLocation = locationRepo.findById(id);
        if (optionalLocation.isEmpty()) {
            return ResponseEntity.badRequest().body("Location not found");
        }
        DonationLocation loc = optionalLocation.get();
        loc.setName(update.getName());
        loc.setAddress(update.getAddress());
        return ResponseEntity.ok(locationRepo.save(loc));
    }

    // --- Tạo lịch hiến máu ---
    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedule(@RequestBody DonationSchedule schedule) {
        return ResponseEntity.ok(scheduleRepo.save(schedule));
    }

    // --- Chỉnh sửa lịch hiến máu ---
    @PutMapping("/schedules/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody DonationSchedule update) {
        Optional<DonationSchedule> optionalSchedule = scheduleRepo.findById(id);
        if (optionalSchedule.isEmpty()) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }
        DonationSchedule schedule = optionalSchedule.get();
        schedule.setDate(update.getDate());
        schedule.setTime(update.getTime());
        return ResponseEntity.ok(scheduleRepo.save(schedule));
    }

    // --- Danh sách đơn đăng ký chờ xác nhận ---
    @GetMapping("/registrations/pending")
    public ResponseEntity<?> getPendingRegistrations() {
        return ResponseEntity.ok(registrationRepo.findByStatus(RegistrationStatus.PENDING));
    }

    // --- Xác nhận đơn đăng ký ---
    @PostMapping("/registrations/{id}/confirm")
    public ResponseEntity<?> confirmRegistration(@PathVariable Long id) {
        Optional<DonationRegistration> opt = registrationRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Registration not found");

        DonationRegistration reg = opt.get();
        reg.setStatus(RegistrationStatus.CONFIRMED);
        registrationRepo.save(reg);

        // Cập nhật kho máu
        bloodInventoryRepo.findByBloodType(reg.getBloodType()).ifPresentOrElse(
                inv -> {
                    inv.setQuantity(inv.getQuantity() + reg.getAmount());
                    bloodInventoryRepo.save(inv);
                },
                () -> {
                    BloodInventory newInv = new BloodInventory();
                    newInv.setBloodType(reg.getBloodType());
                    newInv.setQuantity(reg.getAmount());
                    bloodInventoryRepo.save(newInv);
                }
        );

        // Gửi thông báo
        String email = reg.getUser().getEmail();
        notificationService.sendNotification(email, "Đơn đăng ký hiến máu của bạn đã được xác nhận thành công.");

        return ResponseEntity.ok("Confirmed and inventory updated");
    }

    // --- Hủy đơn đăng ký ---
    @PostMapping("/registrations/{id}/cancel")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        Optional<DonationRegistration> opt = registrationRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Registration not found");

        DonationRegistration reg = opt.get();
        reg.setStatus(RegistrationStatus.CANCELLED);
        registrationRepo.save(reg);

        // Gửi thông báo
        String email = reg.getUser().getEmail();
        notificationService.sendNotification(email, "Đơn đăng ký hiến máu của bạn đã bị hủy.");

        return ResponseEntity.ok("Registration cancelled");
    }

    // --- Xem kho máu ---
    @GetMapping("/inventory")
    public ResponseEntity<?> getBloodInventory() {
        return ResponseEntity.ok(bloodInventoryRepo.findAll());
    }

    // === Xem danh sách Donor ===
    @GetMapping("/users/donors")
    public ResponseEntity<?> getAllDonors() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DONOR));
    }

    // === Xem danh sách MedicalCenter ===
    @GetMapping("/users/medicalcenters")
    public ResponseEntity<?> getAllMedicalCenters() {
        return ResponseEntity.ok(userRepository.findByRole(Role.MEDICALCENTER));
    }

    // === Xem chi tiết Donor theo id ===
    @GetMapping("/users/donors/{id}")
    public ResponseEntity<?> getDonorById(@PathVariable Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.DONOR)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Donor not found"));
    }

    // === Xem chi tiết MedicalCenter theo id ===
    @GetMapping("/users/medicalcenters/{id}")
    public ResponseEntity<?> getMedicalCenterById(@PathVariable Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.MEDICALCENTER)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Medical center not found"));
    }

    // Xem tất cả các lịch
    @GetMapping("/schedules")
    public ResponseEntity<?> getAllSchedules() {
        return ResponseEntity.ok(scheduleRepo.findAll());
    }

    // Xóa lịch theo ID
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        if (!scheduleRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Schedule not found");
        }
        scheduleRepo.deleteById(id);
        return ResponseEntity.ok("Schedule deleted successfully");
    }
}
