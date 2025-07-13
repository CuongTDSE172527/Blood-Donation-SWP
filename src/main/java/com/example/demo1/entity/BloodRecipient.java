package com.example.demo1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "blood_recipients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int age;

    private String bloodType;

    private String gender;

    private double height;

    private double weight;
}
