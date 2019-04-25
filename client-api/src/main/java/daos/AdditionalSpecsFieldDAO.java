package daos;

import entities.AdditionalSpecsFieldEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class AdditionalSpecsFieldDAO extends BaseDAO<AdditionalSpecsFieldEntity, Long> {

	public List<AdditionalSpecsFieldEntity> getFieldsByEquipmentType(long equipmentTypeId) {
		return entityManager.createQuery("select e from AdditionalSpecsFieldEntity e where e.equipmentType.id = :equipmentTypeId and (e.dataType='INTEGER' or e.dataType='DOUBLE') " ,AdditionalSpecsFieldEntity.class)
				.setParameter("equipmentTypeId", equipmentTypeId)
				.getResultList();

	}
}
