package daos;

import entities.ContractorEntity;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;

@Stateless
public class ContractorDAO extends BaseDAO<ContractorEntity, Long> {

}
