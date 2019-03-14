package managers;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import daos.ContractorDAO;
import dtos.notifications.ExpoMessageData;
import dtos.notifications.ExpoMessageWrapper;
import entities.ContractorEntity;
import entities.NotificationDeviceTokenEntity;
import listeners.StartupListener;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;

import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.json.bind.JsonbBuilder;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Singleton
@Startup
public class FirebaseMessagingManager {
	private static final String SERVER_TOKEN_KEY = "AAAAb5A36MQ:APA91bHH4d0d2Qxf9wJjrIL7bUBJblSTB3aNnToPSQPnEtBBnzhuqnK7f9MudQZn9RuEouKVPndX-GCCEgh5rbxMTSof9Con2GCk-CLl8sskMXn1QKo3Wtr9YN9CvShvzqg0X_pA6MHG";
	private static final String DEFAULT_NOTI_ICON = "https://ccp.hoctot.net/public/assets/images/logo.png";


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

	public void sendMessage(String title, String content, long receiverId, HashMap<String, String> data) {

		ContractorEntity managedContractor = contractorDAO.findByIdWithValidation(receiverId);
		List<String> responseList = new ArrayList<>();
		for (NotificationDeviceTokenEntity notificationDeviceToken : managedContractor.getNotificationDeviceTokens()) {
			this.sendMessage(title, content, notificationDeviceToken,data);
		}
	}

	public void sendMessage(String title, String content, long receiverId) {
		this.sendMessage(title, content, receiverId, null);
	}

	public void sendMessage(String title, String content, NotificationDeviceTokenEntity notificationDeviceTokenEntity
			, HashMap<String, String> data) {

		String regisToken = notificationDeviceTokenEntity.getRegistrationToken();

		switch (notificationDeviceTokenEntity.getDeviceType()) {
			case EXPO:
				try {
					sendExpo(title, content, regisToken);
				} catch (IOException e) {
					e.printStackTrace();
				}
				break;
			case WEB:
			case MOBILE:
				sendWebMobile(title, content, regisToken, data);
				break;
		}
	}


	public void sendWebMobile(String title, String content, String regisToken, HashMap<String, String> data) {
		Message message = Message.builder()

				.setNotification(
						new Notification(title, content)
				)
				.setWebpushConfig(getDefaultWebpushConfig(data))
				.setToken(regisToken).build();

		ApiFuture<String> stringApiFuture = FirebaseMessaging.getInstance().sendAsync(message);
		ApiFutures.addCallback(stringApiFuture, new ApiFutureCallback<String>() {
			@Override
			public void onFailure(Throwable throwable) {
				System.out.println("Failed to send message to token " + regisToken);
			}

			@Override
			public void onSuccess(String s) {
				System.out.println("Successfully sent message: " + s);
			}
		}, MoreExecutors.directExecutor());


	}


	public String sendExpo(String title, String content, String token) throws IOException {

		URL url = new URL("https://exp.host/--/api/v2/push/send");
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();

		connection.setUseCaches(false);
		connection.setDoInput(true);
		connection.setDoOutput(true);

		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");

		ExpoMessageData data = new ExpoMessageData(title, content);
		ExpoMessageWrapper expoMessageWrapper = new ExpoMessageWrapper(token, data);
		String requestBody = JsonbBuilder.create().toJson(expoMessageWrapper);

		OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());
		wr.write(requestBody);
		wr.flush();


		StringWriter stringWriter = new StringWriter();
		IOUtils.copy(connection.getInputStream(), stringWriter);

		return stringWriter.toString();
	}

	private WebpushConfig getDefaultWebpushConfig(HashMap<String, String> data) {
		return
				WebpushConfig.builder()
						.setNotification(WebpushNotification.builder()
								.setIcon(DEFAULT_NOTI_ICON)
								.build())
						.putAllData(data)
						.build();
	}


}
