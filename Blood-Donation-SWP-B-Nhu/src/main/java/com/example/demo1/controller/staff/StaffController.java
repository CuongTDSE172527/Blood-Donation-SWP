package com.example.demo1.controller.staff;

import com.example.demo1.entity.*;
import com.example.demo1.entity.enums.RegistrationStatus;
import com.example.demo1.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo1.entity.enums.Role;

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

    // --- Tạo địa điểm ---
    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody DonationLocation location) {
        return ResponseEntity.ok(locationRepo.save(location));
    }
    @GetMapping("/locations/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable Long id) {
        return locationRepo.findById(id)
                .filter(loc -> loc.getId() == id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("location not found"));
    }
    @GetMapping("/locations")
    public ResponseEntity<?> getLocation() {
        return ResponseEntity.ok(locationRepo.findAll());
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


    //Tien


    @GetMapping("/users/donors")
    public ResponseEntity<List<User>> getDonors() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DONOR));
    }

    @GetMapping("/users/donors/{id}")
    public ResponseEntity<?> getDonorById(@PathVariable Long id) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == Role.DONOR)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("donor not found"));
    }


@PutMapping("/inventory/{bloodtype}/add")
    public Optional<BloodInventory> addBlood(String bloodType, int quantity) {
        Optional<BloodInventory> existing = bloodInventoryRepo.findByBloodType(bloodType);

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + quantity);
            return Optional.of(bloodInventoryRepo.save(existing.get()));
        }

        return Optional.empty();
    }
    @PutMapping("/inventory/{bloodtype}/remove")
    public Optional<BloodInventory> removeBlood(String bloodType, int quantity) {
        Optional<BloodInventory> existing = bloodInventoryRepo.findByBloodType(bloodType);

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() - quantity);
            return Optional.of(bloodInventoryRepo.save(existing.get()));
        }

        return Optional.empty();
    }
//    @GetMapping("/inventory/{bloodtype}")
//    public ResponseEntity<?> getBloodTypeById(@PathVariable String bloodtype) {
//        return bloodInventoryRepo.findByBloodType(bloodtype)
//                .filter(bloodInventory -> bloodInventory.getBloodType().equalsIgnoreCase(bloodtype))
//                .<ResponseEntity<?>>map(ResponseEntity::ok)
//                .orElse(ResponseEntity.badRequest().body("Blood not found"));
//    }
    @GetMapping("/inventory/{id}")
    public ResponseEntity<?> getBloodTypeById(@PathVariable Long id) {
        return bloodInventoryRepo.findById(id)
                .filter(bloodInventory -> bloodInventory.getId() == id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Blood not found"));
    }
}

