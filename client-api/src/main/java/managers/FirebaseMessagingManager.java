package managers;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import daos.ContractorDAO;
import entities.ContractorEntity;
import entities.NotificationDeviceTokenEntity;
import listeners.StartupListener;
import org.json.JSONObject;

import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Singleton
@Startup
public class FirebaseMessagingManager {
	private static final String SERVER_TOKEN_KEY = "AAAAb5A36MQ:APA91bHH4d0d2Qxf9wJjrIL7bUBJblSTB3aNnToPSQPnEtBBnzhuqnK7f9MudQZn9RuEouKVPndX-GCCEgh5rbxMTSof9Con2GCk-CLl8sskMXn1QKo3Wtr9YN9CvShvzqg0X_pA6MHG";

	@Inject
	ContractorDAO contractorDAO;


	public void init() throws IOException {
		String firebaseCredentialsPath = "/sonic-arcadia-97210-firebase-adminsdk-1gurg-6c3d84021b.json";
		InputStream firebaseCredentialsStream = StartupListener.class.getResourceAsStream(firebaseCredentialsPath);
		FirebaseOptions firebaseOptions = new FirebaseOptions.Builder()
				.setCredentials(GoogleCredentials.fromStream(firebaseCredentialsStream))
				.build();

		FirebaseApp.initializeApp(firebaseOptions);
	}

	public String sendNotification() throws FirebaseMessagingException {

		String regisToken = "epYM3BuEDJw:APA91bEiCCAOLF2cRapo4u6IE1a59knrPmMvqqOP-T49RQxVZ3EbyiguD0HJG05YJADfSNhS15NHtUA29ctVkl_yX0VIzAh0jS4xGYGrAOIo36i_1vzlMF2gV55bsaO9VJ717aEH5ac8";

		Message message = Message.builder()
				.setNotification(new Notification("wassup ae", "Sent from web-api NGhia"))
				.setWebpushConfig(WebpushConfig.builder()
						.setNotification(WebpushNotification.builder()
								.setIcon("https://ccp.hoctot.net/public/assets/images/logo.png")
								.build())
						.build())
				.setToken(regisToken)
				.build();
		String response = FirebaseMessaging.getInstance().send(message);
		System.out.println("Successfully sent message: " + response);
		return response;
	}

	public InputStream sendNotiWithHTTP() throws IOException {
		URL url = new URL("https://fcm.googleapis.com/fcm/send");
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();

		connection.setUseCaches(false);
		connection.setDoInput(true);
		connection.setDoOutput(true);

		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Authorization", "key=" + SERVER_TOKEN_KEY);

		JSONObject json = new JSONObject();
		json.put("to", "epYM3BuEDJw:APA91bEiCCAOLF2cRapo4u6IE1a59knrPmMvqqOP-T49RQxVZ3EbyiguD0HJG05YJADfSNhS15NHtUA29ctVkl_yX0VIzAh0jS4xGYGrAOIo36i_1vzlMF2gV55bsaO9VJ717aEH5ac8");
		JSONObject info = new JSONObject();
		info.put("title", "wassup ae"); // Notification title
		info.put("body", "sent from Nghia"); // Notification body
		info.put("click_action", "https://ccp.hoctot.net/"); // Notification body
		info.put("icon", "https://ccp.hoctot.net/public/assets/images/logo.png"); // Notification body
		json.put("notification", info);
		OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());
		wr.write(json.toString());
		wr.flush();
		return connection.getInputStream();
	}

	public List<String> sendMessage(String title, String content, long receiverId) {

		ContractorEntity managedContractor = contractorDAO.findByIdWithValidation(receiverId);
		List<String> responseList = new ArrayList<>();
		for (NotificationDeviceTokenEntity notificationDeviceToken : managedContractor.getNotificationDeviceTokens()) {
			String response = this.sendMessage(title, content, notificationDeviceToken.getRegistrationToken());
			responseList.add(response);
		}
		return responseList;
	}

	public String sendMessage(String title, String content, String regisToken) {

		Message message = getDefaultMessageBuilder().setNotification(
				new Notification(title, content)
		).setToken(regisToken).build();

		String response = null;
		try {
			response = FirebaseMessaging.getInstance().send(message);
		} catch (FirebaseMessagingException e) {
			e.printStackTrace();
		}
		System.out.println("Successfully sent message: " + response);
		return response;

	}

	private Message.Builder getDefaultMessageBuilder() {
		return Message.builder()
				.setWebpushConfig(WebpushConfig.builder()
						.setNotification(WebpushNotification.builder()
								.setIcon("https://ccp.hoctot.net/public/assets/images/logo.png")
								.build())
						.build());
	}

}
