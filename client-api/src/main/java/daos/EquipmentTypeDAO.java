package daos;

import entities.EquipmentTypeEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class EquipmentTypeDAO extends BaseDAO<EquipmentTypeEntity, Long> {
	@PersistenceContext
	EntityManager entityManager;

	public List<EquipmentTypeEntity> getAllEquipmentTypes() {
		return entityManager.createNamedQuery("EquipmentTypeEntity.getAllEquipmentType")
				.getResultList();
	}
}
