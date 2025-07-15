package com.example.demo1.service.impl;

import com.example.demo1.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Override
    public void sendNotification(String email, String message) {
        // Giả lập gửi email/thông báo
        System.out.println("Sending notification to " + email + ": " + message);
    }
}
