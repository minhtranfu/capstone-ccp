package daos;

import entities.GeneralEquipmentTypeEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class GeneralEquipmentTypeDAO extends BaseDAO<GeneralEquipmentTypeEntity,Long> {
	@PersistenceContext
	EntityManager entityManager;

}
