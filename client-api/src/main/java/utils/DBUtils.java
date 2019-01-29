package utils;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DBUtils {
    private static final String PERSISTANCE_NAME = "CAPSTONE_CCP";
    private static EntityManagerFactory emf;
    private static final Object LOCK = new Object();

    public DBUtils() {
    }

    public static EntityManager getEntityManager() {
        synchronized (LOCK) {
            if (emf == null) {
                try {
                    emf = Persistence.createEntityManagerFactory(PERSISTANCE_NAME);
                } catch (Exception e) {
                    Logger.getLogger(DBUtils.class.getName()).log(Level.SEVERE, null, e);
                }
            }
        }

        return Persistence.createEntityManagerFactory(PERSISTANCE_NAME).createEntityManager();
    }
}
