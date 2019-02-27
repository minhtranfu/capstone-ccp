package daos;

import entities.GeneralEquipmentTypeEntity;
import utils.DBUtils;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class GeneralEquipmentTypeDAO extends BaseDAO<GeneralEquipmentTypeEntity,Long> {
	@PersistenceContext
	EntityManager entityManager;

	public List<GeneralEquipmentTypeEntity> getAllGeneralEquipmentType() {
		return entityManager.createNamedQuery("GeneralEquipmentTypeEntity.getAllGeneralEquipmentType")
				.getResultList();
	}
}
