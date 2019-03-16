package daos;

import entities.MaterialTypeEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class MaterialTypeDAO extends BaseDAO<MaterialTypeEntity, Long> {
	public List<MaterialTypeEntity> findAll() {
		return entityManager.createNamedQuery("MaterialTypeEntity.findAll", MaterialTypeEntity.class)
				.getResultList();
	}
}
