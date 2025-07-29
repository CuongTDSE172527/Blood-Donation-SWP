package com.example.demo1.controller.admin;

import com.example.demo1.entity.*;
import com.example.demo1.entity.enums.BloodRequestStatus;
import com.example.demo1.entity.enums.RegistrationStatus;
import com.example.demo1.entity.enums.Role;
import com.example.demo1.repo.*;
import com.example.demo1.service.BloodInventoryService;
import com.example.demo1.service.NotificationService;
import com.example.demo1.dto.BloodCompatibilityResponse;
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

    // Lấy danh sách tất cả người dùng
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Tạo người dùng mới
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userRepository.save(user));
    }

    // Cập nhật người dùng
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optional.get();
        if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getDob() != null) user.setDob(updatedUser.getDob());
        if (updatedUser.getGender() != null) user.setGender(updatedUser.getGender());
        if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());

        return ResponseEntity.ok(userRepository.save(user));
    }

    // Xóa người dùng
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Lấy danh sách tài khoản MEDICALCENTER
    @GetMapping("/users/medicalcenters")
    public ResponseEntity<List<User>> getMedicalCenters() {
        List<User> medicalCenters = userRepository.findByRole(Role.MEDICALCENTER);
        
        // Get all donation locations to match with medical centers
        List<DonationLocation> locations = locationRepo.findAll();
        
        // Try to match medical centers with locations by name
        for (User center : medicalCenters) {
            for (DonationLocation location : locations) {
                if (location.getName() != null && center.getFullName() != null) {
                    // Try exact match first
                    if (location.getName().equalsIgnoreCase(center.getFullName())) {
                        center.setAddress(location.getAddress());
                        break;
                    }
                    // Try partial match (in case of encoding issues)
                    if (location.getName().toLowerCase().contains(center.getFullName().toLowerCase()) ||
                        center.getFullName().toLowerCase().contains(location.getName().toLowerCase())) {
                        center.setAddress(location.getAddress());
                        break;
                    }
                }
            }
        }
        
        return ResponseEntity.ok(medicalCenters);
    }

    // Lấy chi tiết tài khoản MEDICALCENTER theo ID
    @GetMapping("/users/medicalcenters/{id}")
    public ResponseEntity<?> getMedicalCenterById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id)
                .filter(user -> user.getRole() == Role.MEDICALCENTER);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Medical center not found");
        }
        
        User user = userOpt.get();
        
        // Try to find matching location by name
        List<DonationLocation> locations = locationRepo.findAll();
        for (DonationLocation location : locations) {
            if (location.getName() != null && user.getFullName() != null) {
                // Try exact match first
                if (location.getName().equalsIgnoreCase(user.getFullName())) {
                    user.setAddress(location.getAddress());
                    break;
                }
                // Try partial match (in case of encoding issues)
                if (location.getName().toLowerCase().contains(user.getFullName().toLowerCase()) ||
                    user.getFullName().toLowerCase().contains(location.getName().toLowerCase())) {
                    user.setAddress(location.getAddress());
                    break;
                }
            }
        }
        
        return ResponseEntity.ok(user);
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

    // Medical Center Management endpoints (alternative paths)
    @PostMapping("/medical-centers")
    public ResponseEntity<?> createMedicalCenterAlt(@RequestBody User user) {
        user.setRole(Role.MEDICALCENTER);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/medical-centers/{id}")
    public ResponseEntity<?> updateMedicalCenterAlt(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty() || optional.get().getRole() != Role.MEDICALCENTER) {
            return ResponseEntity.badRequest().body("Medical center not found");
        }

        User user = optional.get();
        if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/medical-centers/{id}")
    public ResponseEntity<?> deleteMedicalCenter(@PathVariable Long id) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty() || optional.get().getRole() != Role.MEDICALCENTER) {
            return ResponseEntity.badRequest().body("Medical center not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Medical center deleted successfully");
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

        if (updatedUser.getAddress() != null) {
            user.setAddress(updatedUser.getAddress());
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
    
    @Autowired
    private BloodInventoryService bloodInventoryService;

    @GetMapping("/inventory")
    public ResponseEntity<?> getAllBloodInventory() {
        try {
            List<BloodInventory> inventory = bloodInventoryRepo.findAll();
            System.out.println("Found " + inventory.size() + " inventory items");
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            System.err.println("Error fetching blood inventory: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching blood inventory: " + e.getMessage());
        }
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

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<?> deleteBloodInventory(@PathVariable Long id) {
        if (!bloodInventoryRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Blood inventory not found");
        }
        bloodInventoryRepo.deleteById(id);
        return ResponseEntity.ok("Blood inventory deleted successfully");
    }
    @Autowired
    private BloodRequestRepository bloodRequestRepo;

    @GetMapping("/blood-requests")
    public ResponseEntity<?> getAllBloodRequests() {
        try {
            List<BloodRequest> requests = bloodRequestRepo.findAll();
            System.out.println("Found " + requests.size() + " blood requests");
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.err.println("Error fetching blood requests: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching blood requests: " + e.getMessage());
        }
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

    @DeleteMapping("/blood-requests/{id}")
    public ResponseEntity<?> deleteBloodRequest(@PathVariable Long id) {
        if (!bloodRequestRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Blood request not found");
        }
        bloodRequestRepo.deleteById(id);
        return ResponseEntity.ok("Blood request deleted successfully");
    }

    @PutMapping("/blood-requests/{id}")
    public ResponseEntity<?> updateBloodRequest(@PathVariable Long id, @RequestBody BloodRequest updated) {
        Optional<BloodRequest> optional = bloodRequestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Blood request not found");
        }

        BloodRequest req = optional.get();
        if (updated.getStatus() != null) req.setStatus(updated.getStatus());
        if (updated.getRecipientName() != null) req.setRecipientName(updated.getRecipientName());
        if (updated.getRecipientBloodType() != null) req.setRecipientBloodType(updated.getRecipientBloodType());
        if (updated.getRequestedAmount() > 0) req.setRequestedAmount(updated.getRequestedAmount());
        if (updated.getRequestDate() != null) req.setRequestDate(updated.getRequestDate());

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

    @GetMapping("/locations")
    public ResponseEntity<?> getAllLocations() {
        return ResponseEntity.ok(locationRepo.findAll());
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody DonationLocation updated) {
        Optional<DonationLocation> optional = locationRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Location not found");
        }

        DonationLocation location = optional.get();
        if (updated.getName() != null) location.setName(updated.getName());
        if (updated.getAddress() != null) location.setAddress(updated.getAddress());

        return ResponseEntity.ok(locationRepo.save(location));
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        if (!locationRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Location not found");
        }
        locationRepo.deleteById(id);
        return ResponseEntity.ok("Location deleted successfully");
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

        bloodInventoryService.findByBloodType(reg.getBloodType()).ifPresentOrElse(
                inv -> {
                    inv.setQuantity(inv.getQuantity() + reg.getAmount());
                    inv.setUpdatedBy(admin);
                    bloodInventoryService.save(inv);
                },
                () -> {
                    BloodInventory newInv = new BloodInventory();
                    newInv.setBloodType(reg.getBloodType());
                    newInv.setQuantity(reg.getAmount());
                    newInv.setUpdatedBy(admin);
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
    @PostMapping("/blood-requests/{id}/confirm")
    public ResponseEntity<?> confirmBloodRequestWithInventory(@PathVariable Long id) {
        Optional<BloodRequest> opt = bloodRequestRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Request not found");

        BloodRequest req = opt.get();
        Optional<BloodInventory> inventoryOpt = bloodInventoryService.findByBloodType(req.getRecipientBloodType());

        if (inventoryOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy kho máu phù hợp");
        BloodInventory inventory = inventoryOpt.get();

        if (inventory.getQuantity() < req.getRequestedAmount())
            return ResponseEntity.badRequest().body("Không đủ lượng máu trong kho");

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

    // === Confirm Blood Request with Compatibility ===
    @PostMapping("/blood-requests/{id}/confirm-with-compatibility")
    public ResponseEntity<?> confirmBloodRequestWithCompatibility(@PathVariable Long id, 
                                                                @RequestParam(required = false) String alternativeBloodType) {
        Optional<BloodRequest> opt = bloodRequestRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Request not found");

        BloodRequest req = opt.get();
        String bloodTypeToUse = alternativeBloodType != null ? alternativeBloodType : req.getRecipientBloodType();
        
        // Check if the alternative blood type is compatible
        if (alternativeBloodType != null) {
            BloodCompatibilityResponse compatibility = bloodInventoryService.checkBloodAvailabilityWithCompatibility(req.getRecipientBloodType(), req.getRequestedAmount());
            if (!compatibility.getAvailableCompatibleTypes().containsKey(alternativeBloodType)) {
                return ResponseEntity.badRequest().body("Nhóm máu thay thế không tương thích với nhóm máu yêu cầu");
            }
        }

        Optional<BloodInventory> inventoryOpt = bloodInventoryService.findByBloodType(bloodTypeToUse);
        if (inventoryOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy kho máu phù hợp");
        
        BloodInventory inventory = inventoryOpt.get();
        if (inventory.getQuantity() < req.getRequestedAmount()) {
            return ResponseEntity.badRequest().body("Không đủ lượng máu trong kho");
        }

        // Deduct from inventory
        inventory.setQuantity(inventory.getQuantity() - req.getRequestedAmount());
        bloodInventoryService.save(inventory);

        // Update request status
        BloodRequestStatus newStatus;
        if (req.getStatus() == BloodRequestStatus.PENDING || req.getStatus() == BloodRequestStatus.WAITING) {
            newStatus = BloodRequestStatus.CONFIRM;
        } else {
            newStatus = BloodRequestStatus.WAITING;
        }
        
        req.setStatus(newStatus);
        bloodRequestRepo.save(req);

        String message = alternativeBloodType != null ? 
            "Yêu cầu nhận máu đã được xác nhận với nhóm máu thay thế: " + alternativeBloodType :
            "Yêu cầu nhận máu đã được xác nhận";
            
        notificationService.sendNotification(req.getMedicalCenter().getEmail(), message);
        return ResponseEntity.ok("Request confirmed with compatibility");
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
