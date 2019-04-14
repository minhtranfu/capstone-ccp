package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.MaterialEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import com.ccp.webadmin.repositories.EquipmentRepository;
import com.ccp.webadmin.repositories.MaterialRepository;
import com.ccp.webadmin.services.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;

    @Autowired
    public MaterialServiceImpl(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @Override
    public List<MaterialEntity> findAll() {
        return materialRepository.findAll();
    }

    @Override
    public List<MaterialEntity> findByMaterialType(MaterialTypeEntity materialTypeEntity) {
        return materialRepository.findByMaterialTypeEntity(materialTypeEntity);
    }


    public MaterialEntity findById(Integer id) {
        return materialRepository.findById(id).get();
    }

    @Override
    public void save(MaterialEntity materialEntity) {
        materialRepository.save(materialEntity);
    }


    @Override
    public void deleteById(Integer id) {
        materialRepository.deleteById(id);
    }

    @Override
    public List<LineChartStatisticDTO> countMaterial(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = materialRepository.countMaterialByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = materialRepository.countMaterialByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = materialRepository.countMaterialByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = materialRepository.countMaterialByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }

    @Override
    public List<PieChartStatisticDTO> countMaterialByMaterialType(LocalDateTime beginDate, LocalDateTime endDate) {
        return materialRepository.countMaterialByMaterialType(beginDate, endDate);
    }


}
