package com.example.demo1.service;

import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.DonationSchedule;
import com.example.demo1.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class DonationNotificationService {
    
    @Autowired
    private NotificationService notificationService;
    
    public void sendRegistrationConfirmation(DonationRegistration registration) {
        User user = registration.getUser();
        
        String subject = "Blood Donation Registration Confirmation";
        String message = buildConfirmationMessage(registration);
        
        // Send email notification
        notificationService.sendNotification(user.getId(), subject, message);
        
        // You can add SMS notification here if needed
    }
    
    public void sendPreDonationReminder(DonationRegistration registration, DonationSchedule schedule) {
        User user = registration.getUser();
        
        String subject = "Blood Donation Reminder - Tomorrow";
        String message = buildReminderMessage(registration, schedule);
        
        notificationService.sendNotification(user.getId(), subject, message);
    }
    
    public void sendEligibilityResult(DonationRegistration registration, boolean eligible, String reason) {
        User user = registration.getUser();
        
        String subject = eligible ? "Blood Donation - Approved" : "Blood Donation - Additional Review Required";
        String message = buildEligibilityMessage(registration, eligible, reason);
        
        notificationService.sendNotification(user.getId(), subject, message);
    }
    
    private String buildConfirmationMessage(DonationRegistration registration) {
        StringBuilder message = new StringBuilder();
        message.append("Dear ").append(registration.getUser().getName()).append(",\\n\\n");
        message.append("Thank you for registering to donate blood! We have received your registration.\\n\\n");
        
        message.append("REGISTRATION DETAILS:\\n");
        message.append("Registration ID: ").append(registration.getId()).append("\\n");
        message.append("Blood Type: ").append(registration.getBloodType()).append("\\n");
        message.append("Location: ").append(registration.getLocation().getName()).append("\\n");
        message.append("Address: ").append(registration.getLocation().getAddress()).append("\\n");
        
        message.append("\\nPRE-DONATION PREPARATION:\\n");
        message.append("• Eat a healthy meal and drink plenty of water before your appointment\\n");
        message.append("• Get a good night's sleep\\n");
        message.append("• Bring a valid ID\\n");
        message.append("• Avoid alcohol 24 hours before donation\\n");
        message.append("• Inform us of any new medications or health changes\\n");
        
        message.append("\\nCONTACT INFORMATION:\\n");
        message.append("Location: ").append(registration.getLocation().getName()).append("\\n");
        message.append("Address: ").append(registration.getLocation().getAddress()).append("\\n");
        message.append("Phone: ").append(registration.getLocation().getContact()).append("\\n");
        
        message.append("\\nIf you need to cancel or reschedule, please contact us at least 24 hours in advance.\\n\\n");
        message.append("Thank you for your generosity in helping save lives!\\n\\n");
        message.append("Best regards,\\n");
        message.append("Blood Donation Team");
        
        return message.toString();
    }
    
    private String buildReminderMessage(DonationRegistration registration, DonationSchedule schedule) {
        StringBuilder message = new StringBuilder();
        message.append("Dear ").append(registration.getUser().getName()).append(",\\n\\n");
        message.append("This is a friendly reminder about your blood donation appointment tomorrow.\\n\\n");
        
        message.append("APPOINTMENT DETAILS:\\n");
        message.append("Date: ").append(schedule.getDate().format(DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy"))).append("\\n");
        message.append("Time: ").append(schedule.getTime().format(DateTimeFormatter.ofPattern("h:mm a"))).append("\\n");
        message.append("Location: ").append(schedule.getLocation().getName()).append("\\n");
        message.append("Address: ").append(schedule.getLocation().getAddress()).append("\\n");
        
        message.append("\\nPRE-DONATION CHECKLIST:\\n");
        message.append("✓ Eat a healthy meal 2-3 hours before your appointment\\n");
        message.append("✓ Drink plenty of water (avoid alcohol for 24 hours)\\n");
        message.append("✓ Get adequate sleep\\n");
        message.append("✓ Bring a valid photo ID\\n");
        message.append("✓ Wear comfortable clothing with sleeves that can be easily rolled up\\n");
        
        message.append("\\nWHAT TO EXPECT:\\n");
        message.append("• Registration and health screening: 10-15 minutes\\n");
        message.append("• Mini health check: 5-10 minutes\\n");
        message.append("• Blood donation: 8-10 minutes\\n");
        message.append("• Rest and refreshments: 10-15 minutes\\n");
        message.append("• Total time: approximately 45-60 minutes\\n");
        
        message.append("\\nNeed to reschedule? Contact us at: ").append(schedule.getLocation().getContact()).append("\\n\\n");
        message.append("Thank you for your commitment to saving lives!\\n\\n");
        message.append("Best regards,\\n");
        message.append("Blood Donation Team");
        
        return message.toString();
    }
    
    private String buildEligibilityMessage(DonationRegistration registration, boolean eligible, String reason) {
        StringBuilder message = new StringBuilder();
        message.append("Dear ").append(registration.getUser().getName()).append(",\\n\\n");
        
        if (eligible) {
            message.append("Great news! Your blood donation registration has been approved.\\n\\n");
            message.append("You are eligible to donate blood and your appointment is confirmed.\\n");
            
            if (reason != null && !reason.trim().isEmpty()) {\n                message.append("\\nSpecial Notes: ").append(reason).append("\\n");\n            }\n            \n            message.append("\\nWe look forward to seeing you at your scheduled appointment.\\n");\n        } else {\n            message.append("Thank you for your interest in donating blood.\\n\\n");\n            message.append("After reviewing your health screening, we need additional time to evaluate your eligibility.\\n\\n");\n            \n            if (reason != null && !reason.trim().isEmpty()) {\n                message.append("Reason: ").append(reason).append("\\n\\n");\n            }\n            \n            message.append("This does not necessarily mean you cannot donate. Our medical team will review your information and contact you within 2-3 business days.\\n");\n            message.append("\\nIf you have any questions, please contact our medical team at the donation center.\\n");\n        }\n        \n        message.append("\\nThank you for your willingness to help save lives!\\n\\n");\n        message.append("Best regards,\\n");\n        message.append("Blood Donation Medical Team");\n        \n        return message.toString();\n    }\n}"