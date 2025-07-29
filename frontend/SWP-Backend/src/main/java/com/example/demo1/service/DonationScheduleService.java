package com.example.demo1.service;

import com.example.demo1.entity.DonationSchedule;

import java.util.List;

public interface DonationScheduleService {
    DonationSchedule saveOrUpdate(DonationSchedule schedule);
    List<DonationSchedule> findAll();

}
