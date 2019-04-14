package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.DebrisImageEntity;
import com.ccp.webadmin.entities.DebrisPostEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentImageEntity;
import com.ccp.webadmin.repositories.DebrisImageRepository;
import com.ccp.webadmin.repositories.EquipmentImageRepository;
import com.ccp.webadmin.services.DebrisImageService;
import com.ccp.webadmin.services.EquipmentImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DebrisImageServiceImpl implements DebrisImageService {

    private final DebrisImageRepository debrisImageRepository;

    @Autowired
    public DebrisImageServiceImpl(DebrisImageRepository debrisImageRepository) {
        this.debrisImageRepository = debrisImageRepository;
    }

    @Override
    public List<DebrisImageEntity> findAll() {
        return debrisImageRepository.findAll();
    }

    @Override
    public List<DebrisImageEntity> findByDebrisPostEntity(DebrisPostEntity debrisPostEntity) {
        return debrisImageRepository.findAllByDeBrisPostEntity(debrisPostEntity);
    }
}
