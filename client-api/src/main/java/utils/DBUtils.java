package utils;

import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DBUtils {

    public static final String PERSISTANCE_UNIT = "CAPSTONE_CCP";
    private static EntityManagerFactory emf;
    private static final Object LOCK = new Object();


	@PersistenceContext
	EntityManager entityManager;

    public DBUtils() {
    }

//    public static EntityManager getEntityManager() {
//        synchronized (LOCK) {
//            if (emf == null) {
//                try {
//                    emf = Persistence.createEntityManagerFactory(PERSISTANCE_UNIT);
//                } catch (Exception e) {
//                    Logger.getLogger(DBUtils.class.getName()).log(Level.SEVERE, null, e);
//                }
//            }
//        }
//
//        return emf.createEntityManager();
//    }
}
