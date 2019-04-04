package com.ccp.webadmin.services;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.DebrisBidEntity;
import com.ccp.webadmin.entities.DebrisPostEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface DebrisPostService {
    List<DebrisPostEntity> findAll();


    DebrisPostEntity findById(Integer id);

    void save(DebrisPostEntity debrisPostEntity);

    void deleteById(Integer id);

    List<LineChartStatisticDTO> countPost(String byType, LocalDateTime beginDate, LocalDateTime endDate);
}
