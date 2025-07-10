package com.example.demo1.service.impl;

import com.example.demo1.entity.User;
import com.example.demo1.entity.enums.Role;
import com.example.demo1.repo.UserRepository;
import com.example.demo1.service.UserService;

import java.util.List;
import java.util.Optional;

public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    @Override
    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    @Override
    public Optional<User> findById(long id) {
        return userRepository.findById(id);
    }



}
