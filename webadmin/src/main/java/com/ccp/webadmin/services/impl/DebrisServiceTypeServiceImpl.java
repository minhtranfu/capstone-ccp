package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.DebrisServiceTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.DebrisServiceTypeRepository;
import com.ccp.webadmin.repositories.GeneralEquipmentTypeRepository;
import com.ccp.webadmin.services.DebrisServiceTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DebrisServiceTypeServiceImpl implements DebrisServiceTypeService {

    private final DebrisServiceTypeRepository debrisServiceTypeRepository;

    @Autowired
    public DebrisServiceTypeServiceImpl(DebrisServiceTypeRepository debrisServiceTypeRepository) {
        this.debrisServiceTypeRepository = debrisServiceTypeRepository;
    }

    @Override
    public List<DebrisServiceTypeEntity> findAll() {
        return debrisServiceTypeRepository.findAllNotDeleted();
    }

    @Override
    public DebrisServiceTypeEntity findById(Integer id) {
        return debrisServiceTypeRepository.findById(id).get();
    }

    @Override
    public void save(DebrisServiceTypeEntity debrisServiceTypeEntity) {
        debrisServiceTypeRepository.save(debrisServiceTypeEntity);
    }

    @Override
    public void deleteById(Integer id) {
        debrisServiceTypeRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return debrisServiceTypeRepository.existsByName(name);
    }

    @Override
    public List<PieChartStatisticDTO> countDebrisPostByDebrisServiceType(LocalDateTime beginDate, LocalDateTime endDate) {
        return debrisServiceTypeRepository.countDebrisPostByDebrisServiceType(beginDate, endDate);
    }
}
