package daos;

import entities.FeedbackTypeEntity;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;

@Stateless
public class FeedbackTypeDAO extends BaseDAO<FeedbackTypeEntity,Long> {
}
