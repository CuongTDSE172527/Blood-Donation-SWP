package com.example.demo1.controller.medicalcenter;

import com.example.demo1.entity.BloodRecipient;
import com.example.demo1.entity.BloodRequest;
import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.BloodRequestStatus;
import com.example.demo1.entity.enums.Role;
import com.example.demo1.repo.BloodRecipientRepository;
import com.example.demo1.repo.BloodRequestRepository;
import com.example.demo1.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicalcenter")
public class MedicalCenterController {

    @Autowired
    private BloodRecipientRepository recipientRepo;

    @Autowired
    private BloodRequestRepository bloodRequestRepo;

    @Autowired
    private UserRepository userRepo;

    // === 1. Nhập thông tin người nhận máu ===
    @PostMapping("/recipients")
    public ResponseEntity<?> createRecipient(@RequestBody BloodRecipient recipient,
                                             @RequestParam Long medicalCenterId) {
        Optional<User> optionalCenter = userRepo.findById(medicalCenterId);

        if (optionalCenter.isEmpty() || optionalCenter.get().getRole() != Role.MEDICALCENTER) {
            return ResponseEntity.badRequest().body("Medical center not found or invalid");
        }

        recipient.setMcid(optionalCenter.get());
        return ResponseEntity.ok(recipientRepo.save(recipient));
    }

    // === 2. Xem danh sách người nhận máu ===
    @GetMapping("/recipients")
    public ResponseEntity<?> getAllRecipients(@RequestParam Long medicalCenterId) {
        return ResponseEntity.ok(recipientRepo.findByMcidId(medicalCenterId));
    }

    // === 2.1. Xem chi tiết một recipient ===
    @GetMapping("/recipients/{id}")
    public ResponseEntity<?> getRecipientById(@PathVariable Long id) {
        Optional<BloodRecipient> optionalRecipient = recipientRepo.findById(id);
        if (optionalRecipient.isEmpty()) {
            return ResponseEntity.badRequest().body("Recipient not found");
        }
        return ResponseEntity.ok(optionalRecipient.get());
    }

    // === 2.2. Cập nhật recipient ===
    @PutMapping("/recipients/{id}")
    public ResponseEntity<?> updateRecipient(@PathVariable Long id, @RequestBody BloodRecipient updatedRecipient) {
        Optional<BloodRecipient> optionalRecipient = recipientRepo.findById(id);
        if (optionalRecipient.isEmpty()) {
            return ResponseEntity.badRequest().body("Recipient not found");
        }

        BloodRecipient recipient = optionalRecipient.get();
        
        // Cập nhật các trường nếu không null
        if (updatedRecipient.getName() != null) {
            recipient.setName(updatedRecipient.getName());
        }
        if (updatedRecipient.getBloodType() != null) {
            recipient.setBloodType(updatedRecipient.getBloodType());
        }
        if (updatedRecipient.getAge() > 0) {
            recipient.setAge(updatedRecipient.getAge());
        }
        if (updatedRecipient.getGender() != null) {
            recipient.setGender(updatedRecipient.getGender());
        }
        if (updatedRecipient.getHeight() > 0) {
            recipient.setHeight(updatedRecipient.getHeight());
        }
        if (updatedRecipient.getWeight() > 0) {
            recipient.setWeight(updatedRecipient.getWeight());
        }

        return ResponseEntity.ok(recipientRepo.save(recipient));
    }

    // === 2.3. Xóa recipient ===
    @DeleteMapping("/recipients/{id}")
    public ResponseEntity<?> deleteRecipient(@PathVariable Long id) {
        if (!recipientRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Recipient not found");
        }
        recipientRepo.deleteById(id);
        return ResponseEntity.ok("Recipient deleted successfully");
    }

    // === 3. Gửi request nhận máu ===
    @PostMapping("/blood-requests")
    public ResponseEntity<?> createBloodRequest(@RequestBody BloodRequest request,
                                                @RequestParam Long medicalCenterId) {
        Optional<User> optionalCenter = userRepo.findById(medicalCenterId);

        if (optionalCenter.isEmpty() || optionalCenter.get().getRole() != Role.MEDICALCENTER) {
            return ResponseEntity.badRequest().body("Medical center not found or invalid");
        }

        request.setMedicalCenter(optionalCenter.get());
        request.setRequestDate(LocalDate.now());
        request.setStatus(BloodRequestStatus.PENDING); // mặc định khi tạo

        return ResponseEntity.ok(bloodRequestRepo.save(request));
    }

    // === 4. Xem các request đã gửi của medicalcenter ===
    @GetMapping("/blood-requests")
    public ResponseEntity<?> getRequestsByMedicalCenter(@RequestParam Long medicalCenterId) {
        return ResponseEntity.ok(bloodRequestRepo.findByMedicalCenterId(medicalCenterId));
    }

    // === 4.1. Xem chi tiết một blood request ===
    @GetMapping("/blood-requests/{id}")
    public ResponseEntity<?> getBloodRequestById(@PathVariable Long id) {
        Optional<BloodRequest> optionalRequest = bloodRequestRepo.findById(id);
        if (optionalRequest.isEmpty()) {
            return ResponseEntity.badRequest().body("Blood request not found");
        }
        return ResponseEntity.ok(optionalRequest.get());
    }

    // === 5. Cập nhật blood request ===
    @PutMapping("/blood-requests/{id}")
    public ResponseEntity<?> updateBloodRequest(@PathVariable Long id, @RequestBody BloodRequest updatedRequest) {
        Optional<BloodRequest> optionalRequest = bloodRequestRepo.findById(id);
        if (optionalRequest.isEmpty()) {
            return ResponseEntity.badRequest().body("Blood request not found");
        }

        BloodRequest request = optionalRequest.get();
        
        // Cập nhật các trường nếu không null
        if (updatedRequest.getRecipientName() != null) {
            request.setRecipientName(updatedRequest.getRecipientName());
        }
        if (updatedRequest.getRecipientBloodType() != null) {
            request.setRecipientBloodType(updatedRequest.getRecipientBloodType());
        }
        if (updatedRequest.getRequestedAmount() > 0) {
            request.setRequestedAmount(updatedRequest.getRequestedAmount());
        }
        if (updatedRequest.getUrgencyLevel() != null) {
            request.setUrgencyLevel(updatedRequest.getUrgencyLevel());
        }

        return ResponseEntity.ok(bloodRequestRepo.save(request));
    }

    // === 6. Xóa blood request ===
    @DeleteMapping("/blood-requests/{id}")
    public ResponseEntity<?> deleteBloodRequest(@PathVariable Long id) {
        if (!bloodRequestRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Blood request not found");
        }
        bloodRequestRepo.deleteById(id);
        return ResponseEntity.ok("Blood request deleted successfully");
    }
}
