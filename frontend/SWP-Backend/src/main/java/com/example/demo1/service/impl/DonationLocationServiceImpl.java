package com.example.demo1.service.impl;




import com.example.demo1.entity.DonationLocation;
import com.example.demo1.repo.DonationLocationRepository;
import com.example.demo1.service.DonationLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonationLocationServiceImpl implements DonationLocationService {

    @Autowired
    private DonationLocationRepository locationRepository;

    @Override
    public DonationLocation save(DonationLocation location) {
        return locationRepository.save(location);
    }

    @Override
    public Optional<DonationLocation> findById(Long id) {
        return locationRepository.findById(id);
    }

    @Override
    public List<DonationLocation> findAll() {
        return locationRepository.findAll();
    }
}

