package daos;

import entities.GeneralEquipmentTypeEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import java.util.List;

public class GeneralEquipmentTypeDAO extends BaseDAO<GeneralEquipmentTypeEntity,Long> {
	public List<GeneralEquipmentTypeEntity> getAllGeneralEquipmentType() {
		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.createNamedQuery("GeneralEquipmentTypeEntity.getAllGeneralEquipmentType")
				.getResultList();
	}
}
