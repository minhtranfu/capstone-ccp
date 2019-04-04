package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.DebrisBidEntity;
import com.ccp.webadmin.entities.DebrisPostEntity;
import com.ccp.webadmin.repositories.DebrisBidRepository;
import com.ccp.webadmin.repositories.DebrisPostRepository;
import com.ccp.webadmin.services.DebrisPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DebrisPostServiceImpl implements DebrisPostService {

    private final DebrisPostRepository debrisPostRepository;

    @Autowired
    public DebrisPostServiceImpl(DebrisPostRepository debrisPostRepository) {
        this.debrisPostRepository = debrisPostRepository;
    }

    @Override
    public List<DebrisPostEntity> findAll() {
        return debrisPostRepository.findAll();
    }

    @Override
    public DebrisPostEntity findById(Integer id) {
        return debrisPostRepository.findById(id).get();
    }

    @Override
    public void save(DebrisPostEntity debrisPostEntity) {
        debrisPostRepository.save(debrisPostEntity);
    }

    @Override
    public void deleteById(Integer id) {
        debrisPostRepository.deleteById(id);
    }

    @Override
    public List<LineChartStatisticDTO> countPost(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = debrisPostRepository.countDebrisPostByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = debrisPostRepository.countDebrisPostByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = debrisPostRepository.countDebrisPostByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = debrisPostRepository.countDebrisPostByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }



}
