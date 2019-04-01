package com.ccp.webadmin.services;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.DebrisBidEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface DebrisBidService {
    List<DebrisBidEntity> findAll();

//    List<EquipmentEntity> findByEquipmentType(EquipmentTypeEntity equipmentTypeEntity);

    DebrisBidEntity findById(Integer id);

    void save(DebrisBidEntity debrisBidEntity);

    void deleteById(Integer id);

    List<LineChartStatisticDTO> countBid(String byType, LocalDateTime beginDate, LocalDateTime endDate);

    List<PieChartStatisticDTO> countEquipmentByEquipmentType(LocalDateTime beginDate, LocalDateTime endDate);
}
