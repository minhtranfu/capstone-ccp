package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.DebrisServiceTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DebrisServiceTypeService {
    List<DebrisServiceTypeEntity> findAll();

    DebrisServiceTypeEntity findById(Integer id);

    void save(DebrisServiceTypeEntity debrisServiceTypeEntity);

    void deleteById(Integer id);

}
