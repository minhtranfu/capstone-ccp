package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.DebrisBidEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.repositories.DebrisBidRepository;
import com.ccp.webadmin.repositories.EquipmentRepository;
import com.ccp.webadmin.services.DebrisBidService;
import com.ccp.webadmin.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DebrisBidServiceImpl implements DebrisBidService {

    private final DebrisBidRepository debrisBidRepository;

    @Autowired
    public DebrisBidServiceImpl(DebrisBidRepository debrisBidRepository) {
        this.debrisBidRepository = debrisBidRepository;
    }

    @Override
    public List<DebrisBidEntity> findAll() {
        return debrisBidRepository.findAll();
    }

    public DebrisBidEntity findById(Integer id) {
        return debrisBidRepository.findById(id).get();
    }

    @Override
    public void save(DebrisBidEntity debrisBidEntity) {
        debrisBidRepository.save(debrisBidEntity);
    }


    @Override
    public void deleteById(Integer id) {
        debrisBidRepository.deleteById(id);
    }

    @Override
    public List<LineChartStatisticDTO> countBid(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = debrisBidRepository.countDebrisBidByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = debrisBidRepository.countDebrisBidByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = debrisBidRepository.countDebrisBidByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = debrisBidRepository.countDebrisBidByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }

}
