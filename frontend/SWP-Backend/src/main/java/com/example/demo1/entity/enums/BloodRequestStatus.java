package com.example.demo1.entity.enums;

public enum BloodRequestStatus {
    PENDING,   // Mặc định khi tạo
    WAITING,   // Chờ xử lý (Staff đặt)
    PRIORITY,  // Ưu tiên xử lý
    OUT_OF_STOCK,// Đã hết máu
    CONFIRM
}
