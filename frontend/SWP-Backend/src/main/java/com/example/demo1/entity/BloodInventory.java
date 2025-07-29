// BloodInventory.java
package com.example.demo1.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
@Table(name = "blood_inventory")
public class BloodInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType;
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "updated_by_id")
    private User updatedBy;
}
