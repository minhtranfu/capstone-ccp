package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.*;
import com.ccp.webadmin.repositories.EquipmentRepository;
import com.ccp.webadmin.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;

    @Autowired
    public EquipmentServiceImpl(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }


    @Override
    public List<EquipmentEntity> findAll() {
        return equipmentRepository.findAll();
    }

    @Override
    public List<EquipmentEntity> findByEquipmentType(EquipmentTypeEntity equipmentTypeEntity) {
        return equipmentRepository.findByEquipmentTypeEntity(equipmentTypeEntity);
    }


    public EquipmentEntity findById(Integer id) {
        return equipmentRepository.findById(id).get();
    }

    @Override
    public void save(EquipmentEntity equipmentEntity) {
        equipmentRepository.save(equipmentEntity);
    }


    @Override
    public void deleteById(Integer id) {
        equipmentRepository.deleteById(id);
    }

    @Override
    public List<LineChartStatisticDTO> countEquipment(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = equipmentRepository.countEquipmentByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = equipmentRepository.countEquipmentByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = equipmentRepository.countEquipmentByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = equipmentRepository.countEquipmentByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }

    @Override
    public List<PieChartStatisticDTO> countEquipmentByEquipmentType(LocalDateTime beginDate, LocalDateTime endDate) {
        return equipmentRepository.countEquipmentByEquipmentType(beginDate, endDate);
    }


}
