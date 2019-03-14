package daos;

import entities.EquipmentEntity;
import entities.EquipmentTypeEntity;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;

import static org.junit.Assert.*;

//@RunWith(Arquillian.class)
public class SubscriptionDAOTest {
//	@Deployment
	public static JavaArchive createDeployment() {
		return ShrinkWrap.create(JavaArchive.class)
				.addClass(SubscriptionDAO.class)
				.addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml");
	}



	@Test
	public void getMatchedSubscriptions() {

	}
}
