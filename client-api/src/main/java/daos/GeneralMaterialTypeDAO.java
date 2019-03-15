package daos;

import entities.GeneralMaterialTypeEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class GeneralMaterialTypeDAO extends BaseDAO<GeneralMaterialTypeEntity, Long> {
	public List<GeneralMaterialTypeEntity> findAll() {
		return entityManager.createNamedQuery("GeneralMaterialTypeEntity.findAll", GeneralMaterialTypeEntity.class)
				.getResultList();
	}

}
