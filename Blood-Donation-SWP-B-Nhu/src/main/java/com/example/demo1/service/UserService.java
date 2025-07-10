package com.example.demo1.service;

import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.Role;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findByRole(Role role);
    Optional<User> findById(long id);
}
