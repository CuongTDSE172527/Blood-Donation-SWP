package com.example.demo1.service;

import com.example.demo1.entity.DonationRegistration;
import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.Gender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class DonationEligibilityService {
    
    public EligibilityResult checkEligibility(DonationRegistration registration, User user) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        // Basic physical requirements
        checkBasicRequirements(registration, errors);
        
        // Vital signs validation
        checkVitalSigns(registration, user, errors);
        
        // Donation interval validation
        checkDonationInterval(registration, user, errors);
        
        // Risk factors assessment
        checkRiskFactors(registration, errors, warnings);
        
        // Women's health specific checks
        if (user.getGender() == Gender.FEMALE) {
            checkWomensHealth(registration, errors);
        }
        
        // Consent validation
        checkConsent(registration, errors);
        
        boolean isEligible = errors.isEmpty();
        
        return new EligibilityResult(isEligible, errors, warnings);
    }
    
    private void checkBasicRequirements(DonationRegistration registration, List<String> errors) {
        // Weight requirement
        if (registration.getWeight() == null || registration.getWeight() < 45) {
            errors.add("Weight must be at least 45kg");
        }
        
        // Height requirement
        if (registration.getHeight() == null || registration.getHeight() < 140) {
            errors.add("Height must be at least 140cm");
        }
        
        // BMI validation
        if (registration.getWeight() != null && registration.getHeight() != null) {
            double bmi = calculateBMI(registration.getWeight(), registration.getHeight());
            
            if (bmi < 17.0) {
                errors.add("BMI too low (" + String.format("%.1f", bmi) + ") - may increase risk of adverse reactions. Please consult with a healthcare provider.");
            } else if (bmi > 40.0) {
                errors.add("BMI too high (" + String.format("%.1f", bmi) + ") - may increase procedural risks. Special medical evaluation required.");
            }
        }
        
        // Blood type requirement
        if (registration.getBloodType() == null || registration.getBloodType().trim().isEmpty()) {
            errors.add("Blood type is required");
        }
    }
    
    private double calculateBMI(double weight, double height) {
        double heightInMeters = height / 100.0;
        return weight / (heightInMeters * heightInMeters);
    }
    
    private String getBMICategory(double bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        if (bmi < 35) return "Obesity Class I";
        if (bmi < 40) return "Obesity Class II";
        return "Obesity Class III";
    }
    
    private void checkVitalSigns(DonationRegistration registration, User user, List<String> errors) {
        // Blood pressure validation
        if (registration.getSystolicBP() != null && registration.getDiastolicBP() != null) {
            if (registration.getSystolicBP() < 90 || registration.getSystolicBP() > 180) {
                errors.add("Systolic blood pressure must be between 90-180 mmHg");
            }
            if (registration.getDiastolicBP() < 50 || registration.getDiastolicBP() > 100) {
                errors.add("Diastolic blood pressure must be between 50-100 mmHg");
            }
        }
        
        // Heart rate validation
        if (registration.getHeartRate() != null) {
            if (registration.getHeartRate() < 50 || registration.getHeartRate() > 100) {
                errors.add("Heart rate must be between 50-100 bpm");
            }
        }
        
        // Temperature validation
        if (registration.getTemperature() != null) {
            if (registration.getTemperature() < 36.0 || registration.getTemperature() > 37.5) {
                errors.add("Body temperature must be between 36-37.5°C");
            }
        }
        
        // Hemoglobin validation
        if (registration.getHemoglobin() != null) {
            double minHemoglobin = (user.getGender() == Gender.FEMALE) ? 12.5 : 13.5;
            if (registration.getHemoglobin() < minHemoglobin) {
                errors.add(String.format("Hemoglobin must be at least %.1f g/dL", minHemoglobin));
            }
        }
    }
    
    private void checkDonationInterval(DonationRegistration registration, User user, List<String> errors) {
        if (registration.getLastDonationDate() != null) {
            LocalDate lastDonation = registration.getLastDonationDate();
            LocalDate today = LocalDate.now();
            long daysSinceLastDonation = ChronoUnit.DAYS.between(lastDonation, today);
            
            // Minimum interval: 90 days for males, 120 days for females
            long minInterval = (user.getGender() == Gender.FEMALE) ? 120 : 90;
            
            if (daysSinceLastDonation < minInterval) {
                long daysRemaining = minInterval - daysSinceLastDonation;
                errors.add(String.format("Must wait %d more days since last donation", daysRemaining));
            }
        }
    }
    
    private void checkRiskFactors(DonationRegistration registration, List<String> errors, List<String> warnings) {
        LocalDate today = LocalDate.now();
        
        // Recent surgery check
        if (Boolean.TRUE.equals(registration.getRecentSurgery()) && registration.getSurgeryDate() != null) {
            long daysSinceSurgery = ChronoUnit.DAYS.between(registration.getSurgeryDate(), today);
            if (daysSinceSurgery < 180) { // 6 months
                errors.add("Must wait 6 months after major surgery");
            }
        }
        
        // Recent tattoo check
        if (Boolean.TRUE.equals(registration.getRecentTattoo()) && registration.getTattooDate() != null) {
            long daysSinceTattoo = ChronoUnit.DAYS.between(registration.getTattooDate(), today);
            if (daysSinceTattoo < 180) { // 6 months
                errors.add("Must wait 6 months after getting a tattoo");
            }
        }
        
        // Recent piercing check
        if (Boolean.TRUE.equals(registration.getRecentPiercing()) && registration.getPiercingDate() != null) {
            long daysSincePiercing = ChronoUnit.DAYS.between(registration.getPiercingDate(), today);
            if (daysSincePiercing < 180) { // 6 months
                errors.add("Must wait 6 months after getting a piercing");
            }
        }
        
        // Travel to high-risk areas
        if (Boolean.TRUE.equals(registration.getRecentTravel())) {
            warnings.add("Recent travel to endemic areas requires additional screening");
        }
    }
    
    private void checkWomensHealth(DonationRegistration registration, List<String> errors) {
        // Pregnancy check
        if (Boolean.TRUE.equals(registration.getIsPregnant())) {
            errors.add("Pregnant women cannot donate blood");
        }
        
        // Breastfeeding check
        if (Boolean.TRUE.equals(registration.getIsBreastfeeding())) {
            errors.add("Breastfeeding mothers must wait 6 months after delivery");
        }
    }
    
    private void checkConsent(DonationRegistration registration, List<String> errors) {
        if (!Boolean.TRUE.equals(registration.getHealthDeclaration())) {
            errors.add("Health declaration consent is required");
        }
        
        if (!Boolean.TRUE.equals(registration.getConsentForm())) {
            errors.add("Blood donation consent is required");
        }
        
        if (!Boolean.TRUE.equals(registration.getDataProcessingConsent())) {
            errors.add("Data processing consent is required");
        }
    }
    
    public static class EligibilityResult {
        private final boolean eligible;
        private final List<String> errors;
        private final List<String> warnings;
        
        public EligibilityResult(boolean eligible, List<String> errors, List<String> warnings) {
            this.eligible = eligible;
            this.errors = errors;
            this.warnings = warnings;
        }
        
        public boolean isEligible() { return eligible; }
        public List<String> getErrors() { return errors; }
        public List<String> getWarnings() { return warnings; }
    }
}