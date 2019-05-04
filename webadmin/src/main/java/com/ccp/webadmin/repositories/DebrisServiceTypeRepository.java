package com.ccp.webadmin.repositories;

import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.DebrisServiceTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DebrisServiceTypeRepository extends JpaRepository<DebrisServiceTypeEntity, Integer>
{
    @Query("Select e from DebrisServiceTypeEntity e where e.isDeleted = false")
    List<DebrisServiceTypeEntity> findAllNotDeleted();

    @Query("select new com.ccp.webadmin.dtos.PieChartStatisticDTO(" +
            "e.name, size(e.debrisPosts))"+
            "from DebrisServiceTypeEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY e.name, size(e.debrisPosts)")
    List<PieChartStatisticDTO> countDebrisPostByDebrisServiceType(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    boolean existsByName(String name);
}
