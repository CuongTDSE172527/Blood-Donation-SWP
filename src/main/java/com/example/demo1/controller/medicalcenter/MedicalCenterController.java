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
    public ResponseEntity<?> createRecipient(@RequestBody BloodRecipient recipient) {
        return ResponseEntity.ok(recipientRepo.save(recipient));
    }

    // === 2. Xem danh sách người nhận máu ===
    @GetMapping("/recipients")
    public ResponseEntity<?> getAllRecipients() {
        return ResponseEntity.ok(recipientRepo.findAll());
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
}
