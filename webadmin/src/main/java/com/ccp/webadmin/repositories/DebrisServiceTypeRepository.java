package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.DebrisServiceTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DebrisServiceTypeRepository extends JpaRepository<DebrisServiceTypeEntity, Integer>
{
}
