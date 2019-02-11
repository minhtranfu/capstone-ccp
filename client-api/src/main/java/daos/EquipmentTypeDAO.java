package daos;

import entities.EquipmentTypeEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import java.util.List;

public class EquipmentTypeDAO extends BaseDAO<EquipmentTypeEntity, Long> {
	public List<EquipmentTypeEntity> getAllEquipmentTypes() {
		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.createNamedQuery("EquipmentTypeEntity.getAllEquipmentType")
				.getResultList();
	}
}
