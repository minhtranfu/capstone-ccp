package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationDeviceTokenRepository extends JpaRepository<NotificationDeviceTokenEntity, Integer>
{
    List<NotificationDeviceTokenEntity> findAllByContractorEntity(ContractorEntity contractorEntity);
}
