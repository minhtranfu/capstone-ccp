package listeners;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import managers.FirebaseMessagingManager;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Startup
@Singleton
public class StartupListener {

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;
	@PostConstruct
	public void init() throws IOException {
		firebaseMessagingManager.init();

	}

}
