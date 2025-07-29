package com.example.demo1.service.impl;

import com.example.demo1.entity.DonationSchedule;
import com.example.demo1.repo.DonationScheduleRepository;
import com.example.demo1.service.DonationScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationScheduleServiceImpl implements DonationScheduleService {

    @Autowired
    private DonationScheduleRepository scheduleRepository;

    @Override
    public DonationSchedule saveOrUpdate(DonationSchedule schedule) {
        return scheduleRepository.save(schedule);
    }
    @Override
    public List<DonationSchedule> findAll() {
        return scheduleRepository.findAll();
    }

}
