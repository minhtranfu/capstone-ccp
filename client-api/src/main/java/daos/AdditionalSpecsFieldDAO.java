package daos;

import entities.AdditionalSpecsFieldEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class AdditionalSpecsFieldDAO extends BaseDAO<AdditionalSpecsFieldEntity, Long> {

	public List<AdditionalSpecsFieldEntity> getFieldsByEquipmentType(long equipmentTypeId, boolean includeDeletedOnes) {

		//no need to check soft detle
		String query = "select e from AdditionalSpecsFieldEntity e where e.equipmentType.id = :equipmentTypeId and (e.dataType='INTEGER' or e.dataType='DOUBLE') ";

		if (!includeDeletedOnes) {
			query += " and e.deleted = false ";
		}

		return entityManager.createQuery(query ,AdditionalSpecsFieldEntity.class)
				.setParameter("equipmentTypeId", equipmentTypeId)
				.getResultList();

	}
}
