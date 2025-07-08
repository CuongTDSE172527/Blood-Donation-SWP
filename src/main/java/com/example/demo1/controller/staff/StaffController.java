package com.example.demo1.controller.staff;

import com.example.demo1.entity.BloodInventory;
import com.example.demo1.entity.DonationLocation;
import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.DonationSchedule;
import com.example.demo1.entity.enums.RegistrationStatus;
import com.example.demo1.repo.BloodInventoryRepository;
import com.example.demo1.repo.DonationLocationRepository;
import com.example.demo1.repo.DonationRegistrationRepository;
import com.example.demo1.repo.DonationScheduleRepository;
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
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Registration not found");
        }

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

        return ResponseEntity.ok("Registration confirmed and inventory updated");
    }

    // --- Hủy đơn đăng ký ---
    @PostMapping("/registrations/{id}/cancel")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        Optional<DonationRegistration> opt = registrationRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Registration not found");
        }

        DonationRegistration reg = opt.get();
        reg.setStatus(RegistrationStatus.CANCELLED);
        registrationRepo.save(reg);

        return ResponseEntity.ok("Registration cancelled and donor notified");
    }

    // --- Xem kho máu ---
    @GetMapping("/inventory")
    public ResponseEntity<?> getBloodInventory() {
        return ResponseEntity.ok(bloodInventoryRepo.findAll());
    }
}
